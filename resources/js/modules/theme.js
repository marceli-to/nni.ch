import debounce from './debounce.js';

(function () {
  const selectors = {
    theme: {
      header: 'header[data-icon-theme]',
      section: 'section[data-section-theme]',
    },
  };

  let lastScrollY = window.scrollY;

  const checkAndUpdateTheme = () => {
    const currentScrollY = window.scrollY;
    const scrollDown = currentScrollY > lastScrollY;
    const sections = Array.from(document.querySelectorAll(selectors.theme.section));
    const header = document.querySelector(selectors.theme.header);
    if (!header) return;

    let relevantSection = null;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      if (scrollDown) {
        if (rect.top < 50 && rect.bottom > 0) {
          relevantSection = section;
          break;
        }
      } else {
        if (rect.bottom > 50 && rect.top < 0) {
          relevantSection = section;
        }
      }
    }

    if (relevantSection) {
      const theme = relevantSection.getAttribute('data-section-theme');
      header.setAttribute('data-icon-theme', theme);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', debounce(checkAndUpdateTheme, 10), { passive: true });

  checkAndUpdateTheme();
})();
