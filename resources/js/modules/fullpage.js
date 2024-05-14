/*!
 * swiped-events.js - v1.2.0
 * Pure JavaScript swipe events
 * https://github.com/john-doherty/swiped-events
 * @inspiration https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
!function(t,e){"use strict";"function"!=typeof t.CustomEvent&&(t.CustomEvent=function(t,n){n=n||{bubbles:!1,cancelable:!1,detail:void 0};var a=e.createEvent("CustomEvent");return a.initCustomEvent(t,n.bubbles,n.cancelable,n.detail),a},t.CustomEvent.prototype=t.Event.prototype),e.addEventListener("touchstart",function(t){if("true"===t.target.getAttribute("data-swipe-ignore"))return;l=t.target,r=Date.now(),n=t.touches[0].clientX,a=t.touches[0].clientY,u=0,i=0,o=t.touches.length},!1),e.addEventListener("touchmove",function(t){if(!n||!a)return;var e=t.touches[0].clientX,r=t.touches[0].clientY;u=n-e,i=a-r},!1),e.addEventListener("touchend",function(t){if(l!==t.target)return;var c=parseInt(s(l,"data-swipe-threshold","20"),10),d=s(l,"data-swipe-unit","px"),p=parseInt(s(l,"data-swipe-timeout","500"),10),h=Date.now()-r,v="",b=t.changedTouches||t.touches||[];"vh"===d&&(c=Math.round(c/100*e.documentElement.clientHeight));"vw"===d&&(c=Math.round(c/100*e.documentElement.clientWidth));Math.abs(u)>Math.abs(i)?Math.abs(u)>c&&h<p&&(v=u>0?"swiped-left":"swiped-right"):Math.abs(i)>c&&h<p&&(v=i>0?"swiped-up":"swiped-down");if(""!==v){var E={dir:v.replace(/swiped-/,""),touchType:(b[0]||{}).touchType||"direct",fingers:o,xStart:parseInt(n,10),xEnd:parseInt((b[0]||{}).clientX||-1,10),yStart:parseInt(a,10),yEnd:parseInt((b[0]||{}).clientY||-1,10)};l.dispatchEvent(new CustomEvent("swiped",{bubbles:!0,cancelable:!0,detail:E})),l.dispatchEvent(new CustomEvent(v,{bubbles:!0,cancelable:!0,detail:E}))}n=null,a=null,r=null},!1);var n=null,a=null,u=null,i=null,r=null,l=null,o=0;function s(t,n,a){for(;t&&t!==e.documentElement;){var u=t.getAttribute(n);if(u)return u;t=t.parentNode}return a}}(window,document);

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
  let touchStartY = 0;

  const init = () => {
    slides = document.querySelectorAll(selectors.slide);
    const slidesWrapper = document.querySelector(selectors.slidesWrapper);
    if (slidesWrapper) {
      slidesWrapper.addEventListener('wheel', handleWheelEvent);
      slidesWrapper.addEventListener('swiped-down', handleTouchEvent);
      slidesWrapper.addEventListener('swiped-up', handleTouchEvent);
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

  const handleTouchStartEvent = (event) => {
    touchStartY = event.touches[0].clientY;
    // document.addEventListener('touchend', handleTouchEndEvent);
  };
  
  const handleTouchEndEvent = (event) => {
    const touchEndY = event.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    const direction = deltaY > 0 ? 'down' : 'up';
    nextSlide(direction);
  };

  const handleTouchEvent = (event) => {
    const direction = event.detail.dir;
    nextSlide(direction);
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
      resetSlides();
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

    // if we are leaving the first section, hide the byline and show the svg immediately
    if (origin.index === 0) {

      // add class 'is-visible' to all svgs with data-icon-theme
      const svgs = document.querySelectorAll(`svg[${selectors.iconTheme}]`);
      if (svgs) {
        svgs.forEach(svg => {
          svg.classList.add('is-visible');
        });
      }

      // hide data-video-animation="logoByline"
      const logoByline = document.querySelector('[data-video-animation="logoByline"]');
      if (logoByline) {
        logoByline.classList.add('hidden');
      }
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

  const resetSlides = () => {
    // remove 'visible' class from all slides
    slides.forEach(slide => {
      slide.classList.remove('visible');
    });
    // add 'visible' class to the first slide
    slides[0].classList.add('visible');
  };
  
  if (document.querySelector(selectors.container)) {
    init();
  }

})();
