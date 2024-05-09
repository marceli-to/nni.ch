import fullpage from 'fullpage.js';

(function () {

  const init = () => {

    const selector = '#fullpage';
    // check if the element exists
    if (!document.querySelector(selector)) {
      return;
    }

    const fullPageInstance = new fullpage(selector, {
      licenseKey: 'O6CM9-7M5PI-Y4VK9-JVO3H-ZKKOM',
      // anchors:['portfolio', 'expertise', 'unternehmen', 'services'],
      navigation: false,
      lazyLoading: true,
      fitToSection: true,
      //scrollOverflowMacStyle: true,
      bigSectionsDestination: 'top',
      touchSensitivity: 20,
      credits: { enabled: false},
      afterLoad: function(origin, destination, direction, trigger){
        const nextSection = destination.item;
        const theme = nextSection.getAttribute('data-section-theme');
        if (!theme) return;
        const header = document.querySelector('header[data-icon-theme]');
        if (!header) return;
        header.setAttribute('data-icon-theme', theme);

        // find video element with data-video attribute
        const video = nextSection.querySelector('video[data-video]');
        if (video) {
          video.play();
        }
      },
    });
  };

  init();
})();
