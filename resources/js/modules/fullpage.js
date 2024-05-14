import fullpage from 'fullpage.js';

(function () {

  const selectors = {
    header: '#header',
    container: '#fullpage',
    video: 'video',
    sectionTheme: 'data-section-theme',
    iconTheme: 'data-icon-theme',
    slidesWrapper: '.section-slides',
    slide: '[data-slide]'
  };

  let fullPageInstance;
  let currentSlide = 0;
  let slides;
  let isHandlingWheelEvent = false;

  const init = () => {
    slides = document.querySelectorAll(selectors.slide);
    const slidesWrapper = document.querySelector(selectors.slidesWrapper);
    if (slidesWrapper) {
      slidesWrapper.addEventListener('wheel', handleWheelEvent);
      slidesWrapper.addEventListener('touchmove', handleTouchMoveEvent);
    }

    fullPageInstance = new fullpage(selectors.container, {
      licenseKey: 'O6CM9-7M5PI-Y4VK9-JVO3H-ZKKOM',
      navigation: false,
      lazyLoading: true,
      fitToSection: true,
      bigSectionsDestination: 'top',
      touchSensitivity: 20,
      credits: { enabled: false },
      afterRender: handleAfterRender,
      afterLoad: handleAfterLoad,
      onLeave: handleOnLeave
    });
  };

  const handleTouchMoveEvent = (event) => {
    if (isHandlingWheelEvent) return; // Ignore touch events if already handling one
    isHandlingWheelEvent = true;
    const direction = event.touches[0].clientY > touchStartY ? 'down' : 'up';
    nextSlide(direction);
    setTimeout(() => {
      isHandlingWheelEvent = false;
    }, 500);
  };

  const handleWheelEvent = (event) => {
    if (isHandlingWheelEvent) return; // Ignore wheel events if already handling one
    isHandlingWheelEvent = true;
    const direction = event.deltaY > 0 ? 'down' : 'up';
    nextSlide(direction);
    setTimeout(() => {
      isHandlingWheelEvent = false;
    }, 500);
  };

  const handleAfterRender = () => {
    const hash = window.location.hash;
    if (hash) {
      const header = document.querySelector(selectors.header);
      header.classList.add('prevent-animation');
    }
  };

  const handleAfterLoad = (origin, destination, direction) => {
    const destinationHasSlides = destination.item.classList.contains('section-slides');
    if (destinationHasSlides) {
      preventScrolling();
    }
    playVideo(destination.item);
    if (destination.item && direction === 'down') {
      changeTheme(destination.item);
    }
  };

  const handleOnLeave = (origin, destination, direction) => {
    if (origin.item) {
      origin.item.classList.add('visited');
      pauseVideo(origin.item);
    }
    if (destination.item && direction === 'up') {
      changeTheme(destination.item);
    }
  };

  const allowScrolling = () => {
    if (!fullPageInstance) return;
    fullPageInstance.setAllowScrolling(true);
  };

  const preventScrolling = () => {
    if (!fullPageInstance) return;
    fullPageInstance.setAllowScrolling(false);
  };

  const changeTheme = (section) => {
    const theme = section.getAttribute(selectors.sectionTheme);
    if (!theme) return;
    const header = document.querySelector(`header[${selectors.iconTheme}]`);
    if (!header) return;
    header.setAttribute(selectors.iconTheme, theme);
  };

  const playVideo = (section) => {
    const video = section.querySelector(selectors.video);
    if (!video) return;
    video.play();
    if (!video.paused) {
      section.classList.add('running');
      const header = document.querySelector(selectors.header);
      header.classList.add('running');
    }
  };

  const pauseVideo = (section) => {
    const video = section.querySelector(selectors.video);
    if (!video) return;
    video.pause();
    section.classList.remove('running');
  };

  const nextSlide = (direction) => {
    // Calculate the index of the next slide
    let nextSlideIndex = currentSlide + (direction === 'down' ? 1 : -1);
    
    // Ensure the next slide index is within bounds
    if (nextSlideIndex < 0 || nextSlideIndex >= slides.length) {
      // Check if we're at the last slide and scrolling down
      if (direction === 'down' && currentSlide === slides.length - 1) {
        allowScrolling();
      }
      // Check if we're at the first slide and scrolling up
      else if (direction === 'up' && currentSlide === 0) {
        allowScrolling();
      }
      return;
    }
  
    // Hide the current slide
    slides[currentSlide].classList.remove('visible');
    slides[currentSlide].classList.add('hidden');
    
    // Show the next slide
    slides[nextSlideIndex].classList.remove('hidden');
    slides[nextSlideIndex].classList.add('visible');
  
    // Update the current slide index
    currentSlide = nextSlideIndex;
  };
  
  if (document.querySelector(selectors.container)) {
    init();
  }

})();
