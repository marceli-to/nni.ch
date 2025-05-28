import debounce from './debounce.js';

(function () {
  const selectors = {
    sectionObserve: '[data-section-observe]',
    sectionSnap: '[data-section-snap]',
    sectionIntro: '[data-intro-observe]',
    logoByline: '[data-logo-byline]',
    header: '#header',
    video: 'video',
    themeSection: 'section[data-section-theme]',
  };

  let currentSection = null;
  let lastScrollY = window.scrollY;
  
  // Cache DOM elements
  const sections = document.querySelectorAll(selectors.sectionObserve);
  const header = document.querySelector(selectors.header);
  const logoByline = document.querySelector(selectors.logoByline);
  const themeSections = Array.from(document.querySelectorAll(selectors.themeSection));

  const init = () => {
    handleOnLoad();
    
    if (sections.length > 0) {
      initIntersectionObserver();
    }
    
    if (themeSections.length > 0) {
      initScrollObserver();
    }
  };

  const initIntersectionObserver = () => {
    currentSection = sections[0];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (currentSection && entry.target !== currentSection) {
            pauseVideo(currentSection);
          }

          if (entry.target !== currentSection && entry.target.hasAttribute('data-section-snap')) {
            entry.target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }

          handleActiveSection(entry.target);
          setTheme(entry.target.getAttribute('data-section-theme'));
          currentSection = entry.target;
        }
      });
    }, { threshold: 0.25 });
    
    sections.forEach(section => observer.observe(section));
  };

  const initScrollObserver = () => {
    const debouncedThemeUpdate = debounce(checkAndUpdateTheme, 10);
    window.addEventListener('scroll', debouncedThemeUpdate, { passive: true });
    document.body.addEventListener('scroll', debouncedThemeUpdate, { passive: true });
    checkAndUpdateTheme();
  };

  const handleOnLoad = () => {
    if (window.location.hash && header) {
      header.classList.add('prevent-animation');
    }
  };

  const handleActiveSection = (section) => {
    section.classList.add('is-active');

    // Handle intro section: if section is not intro, hide logoByline
    if (logoByline && !section.matches(selectors.sectionIntro)) {
      logoByline.classList.add('hidden');
    }
    
    // Play video if present
    const video = section.querySelector(selectors.video);
    if (video) {
      playVideo(video, section);
    }
  };

  const setTheme = (theme) => {
    if (theme && header) {
      header.setAttribute('data-icon-theme', theme);
    }
  };

  const checkAndUpdateTheme = () => {
    if (!header || themeSections.length === 0) return;
    
    const currentScrollY = window.scrollY;
    const scrollDown = currentScrollY > lastScrollY;
    let relevantSection = null;
    
    for (const section of themeSections) {
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
      setTheme(relevantSection.getAttribute('data-section-theme'));
    }
    
    lastScrollY = currentScrollY;
  };

  const playVideo = async (video, section) => {
    try {
      await video.play();
      section.classList.add('is-playing');
      if (header) {
        header.classList.add('is-playing');
      }
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  const pauseVideo = (section) => {
    const video = section.querySelector(selectors.video);
    if (video) {
      video.pause();
      section.classList.remove('is-running');
    }
  };

  init();
})();