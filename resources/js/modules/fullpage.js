import fullpage from 'fullpage.js';

(function () {
  const selector = '#fullpage';

  const init = () => {

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
      scrollOverflowMacStyle: true,
      touchSensitivity: 20,
      credits: { enabled: false},
      beforeLeave: function(origin, destination, direction, trigger){},
      onLeave: function(origin, destination, direction, trigger){},
      afterLoad: function(origin, destination, direction, trigger){
        const nextSection = destination.item;
        const theme = nextSection.getAttribute('data-section-theme');
        if (!theme) return;
        const header = document.querySelector('header[data-icon-theme]');
        if (!header) return;
        header.setAttribute('data-icon-theme', theme);
      },
      afterRender: function(){},
      afterResize: function(width, height){},
      afterReBuild: function(){},
      afterResponsive: function(isResponsive){},
      afterSlideLoad: function(section, origin, destination, direction, trigger){},
      onSlideLeave: function(section, origin, destination, direction, trigger){},
      onScrollOverflow: function(section, slide, position, direction){}
    });
  };

  init();
})();
