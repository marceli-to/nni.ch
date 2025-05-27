(function () {
  const selectors = {
    sectionObserve: '[data-section-observe]',
    sectionSnap: '[data-section-snap]',
    sectionIntro: '[data-section-observe-intro]',
    logoByline: '[data-logo-byline]',
    header: '#header',
    quickNav: '[data-nav-theme]',
    video: 'video',
    anchor: '[data-anchor]',
  };

  let currentSection = null;
  const sections = document.querySelectorAll(selectors.sectionObserve);
  const header = document.querySelector(selectors.header);
  const quickNav = document.querySelector(selectors.quickNav);

  const init = () => {
    handleOnLoad();
    currentSection = sections[0];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (currentSection && entry.target !== currentSection) {
            pauseVideo(currentSection);
          }

          if (entry.target !== currentSection && entry.target.hasAttribute('data-section-snap') && !entry.target.classList.contains('has-snapped')) {
            entry.target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
            entry.target.classList.add('has-snapped');
          }

          handleActiveSection(entry.target);
          handleTheme(entry.target);
          currentSection = entry.target;
        }
      });
    }, { threshold: 0.25 });
    sections.forEach(section => observer.observe(section));

  };

  const handleOnLoad = () => {
    const hash = window.location.hash;
    if (hash) {
      header.classList.add('prevent-animation');
      scrollToAnchor(hash.replace('#', ''));
    }
  };

  const handleActiveSection = (section) => {
    section.classList.add('is-active');

    // Handle intro section: if section is not intro, add class 'hidden' to logoByline
    if (!section.matches(selectors.sectionIntro)) {
      const logoByline = document.querySelector(selectors.logoByline);
      if (logoByline) {
        logoByline.classList.add('hidden');
      }
    }
    
    // Play video
    const video = section.querySelector(selectors.video);
    if (video) {
      playVideo(video, section);
    }
  };

  const handleTheme = (section) => {
    const theme = section.getAttribute('data-section-theme');
    if (theme) {
      header.setAttribute('data-icon-theme', theme);
      quickNav.setAttribute('data-nav-theme', theme);
    }
  };

  const playVideo = (video, section) => {
    const header = document.querySelector(selectors.header);
    
    video.play().then(() => {
      section.classList.add('is-playing');
      header.classList.add('is-playing');
    }).catch(error => {
      console.error('Error playing video:', error);
    });
  };

  const pauseVideo = (section) => {
    const video = section.querySelector(selectors.video);
    if (!video) return;
    video.pause();
    section.classList.remove('is-running');
  };

  init();
})();