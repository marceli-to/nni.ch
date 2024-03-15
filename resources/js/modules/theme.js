(function () {

  // Selectors
  const selectors = {
    theme: {
      container: '[data-section-container]',
      header: 'header[data-icon-theme]',
      section: 'section[data-section-theme]',
      icon: 'svg[data-icon-theme]',
    },
  };

  // Debounce delay in milliseconds
  const debounceDelay = 100;

  const init = () => {
    if (document.querySelector(selectors.theme.container)) {
      document.querySelector(selectors.theme.container).addEventListener('scroll', debouncedChange);
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const change = () => {
    const sections = document.querySelectorAll(selectors.theme.section);
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight / 2) {
        const theme = section.getAttribute('data-section-theme');
        const header = document.querySelector(selectors.theme.header);
        header.setAttribute('data-icon-theme', theme);
      }
    });
  };

  // Wrapped change function with debounce
  const debouncedChange = debounce(change, debounceDelay);

  init();
})();