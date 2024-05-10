import fullpage from 'fullpage.js';
import { start } from 'nprogress';

(function () {

  const selectors = {
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
      afterLoad: function(origin, destination, direction, trigger){
        if (destination.item) {
          changeTheme(destination.item);
          playVideo(destination.item);
        }
      },
      onLeave: function(origin, destination, direction){
        if (origin.item) {
          origin.item.classList.add('visited');
          pauseVideo(origin.item);
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
  };

  const pauseVideo = (section) => {
    const video = section.querySelector(selectors.video);
    if (!video) return;
    video.pause();
  }

  init();
})();
