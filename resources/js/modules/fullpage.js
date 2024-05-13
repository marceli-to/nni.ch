import fullpage from 'fullpage.js';

(function () {

  const selectors = {
    header: '#header',
    container: '#fullpage',
    video: 'video',
    sectionTheme: 'data-section-theme',
    iconTheme: 'data-icon-theme',
  };

  const init = () => {

    if (!document.querySelector(selectors.container)) {
      return;
    }

    const fullPageInstance = new fullpage(selectors.container, {
      licenseKey: 'O6CM9-7M5PI-Y4VK9-JVO3H-ZKKOM',
      navigation: false,
      lazyLoading: true,
      fitToSection: true,
      bigSectionsDestination: 'top',
      touchSensitivity: 20,
      credits: { enabled: false},
      afterRender: function(){
        setTimeout(() => {
          document.querySelector(selectors.container).classList.remove('opacity-0');
        }, 250);

        // if the url contains a hash, set class 'running' to the header
        const hash = window.location.hash;
        if (hash) {
          const header = document.querySelector(selectors.header);
          header.classList.add('prevent-animation');
        }
      },
      afterLoad: function(origin, destination, direction, trigger){
        playVideo(destination.item);
        if (destination.item && direction === 'down') {
          changeTheme(destination.item);
        }
      },
      onLeave: function(origin, destination, direction){
        if (origin.item) {
          origin.item.classList.add('visited');
          pauseVideo(origin.item);
        }
        if (destination.item && direction === 'up') {
          changeTheme(destination.item);
        }
      },
    });
  };

  const changeTheme = (section) => {
    const theme = section.getAttribute(selectors.sectionTheme);
    if (!theme) return;
    const header = document.querySelector('header['+ selectors.iconTheme +']');
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
  }

  init();
})();
