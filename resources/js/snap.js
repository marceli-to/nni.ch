(function () {
  const selectors = {
    section: '[data-section-snap]',
    sectionIntro: '[data-section-snap-intro]',
    logoByline: '[data-logo-byline]',
    header: '#header',
    video: 'video',
    anchor: '[data-anchor]',
    anchorTarget: '[data-anchor-target]',
  };

  let currentSection = null;
  const sections = document.querySelectorAll(selectors.section);
  const header = document.querySelector(selectors.header);
  
  const init = () => {
    handleOnLoad();
    currentSection = sections[0];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (currentSection && entry.target !== currentSection) {
            pauseVideo(currentSection);
          }
          handleSnapped(entry.target);
          handleTheme(entry.target);
          currentSection = entry.target;
        }
      });
    }, { threshold: 0.25 });
    sections.forEach(section => observer.observe(section));

    // Handle anchors
    const anchors = document.querySelectorAll(selectors.anchor);
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

  };

  const handleOnLoad = () => {
    const hash = window.location.hash;
    if (hash) {
      header.classList.add('prevent-animation');
      scrollToAnchor(hash.replace('#', ''));
    }
  };

  const handleSnapped = (section) => {
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
    }
  };

  const handleAnchorClick = (event) => {
    const anchor = event.currentTarget;
    scrollToAnchor(anchor.dataset.anchor);
  };

  const scrollToAnchor = (anchor) => {
    const target = document.querySelector('[data-anchor-target="' + anchor + '"]');
    if (target) {
      history.pushState(null, null, '#' + anchor);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

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