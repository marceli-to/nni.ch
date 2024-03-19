(function () {
  // Selectors
  const selectors = {
    theme: {
      header: 'header[data-icon-theme]',
      section: 'section[data-section-theme]',
    },
  };

  const init = () => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const theme = entry.target.getAttribute('data-section-theme');
          const header = document.querySelector(selectors.theme.header);
          header.setAttribute('data-icon-theme', theme);
        }
      });
    }, {threshold: 0.1, rootMargin: "50px 0px 50px 0px"}); // Configure to trigger when 50% of the section is visible

    // Observe all sections
    document.querySelectorAll(selectors.theme.section).forEach(section => {
      observer.observe(section);
    });
  };

  init();
})();
