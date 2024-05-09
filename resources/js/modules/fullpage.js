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
      navigation: false,
      lockAnchors: true,
      lazyLoading: true,
      fitToSection: true,
      paddingTop: '120px',
      paddingBottom: '30px',
      fixedElements: '.site-header',
      scrollOverflowMacStyle: true,
      touchSensitivity: 20,
      credits: { enabled: false},
      afterLoad: function(origin, destination, direction, trigger){
        const nextSection = destination.item;
        const theme = nextSection.getAttribute('data-section-theme');
        if (!theme) return;
        const header = document.querySelector('header[data-icon-theme]');
        if (!header) return;
        header.setAttribute('data-icon-theme', theme);
      },
    });
  };

  init();
})();
