/**
 * Section observer: drives the active-section state, header theme, video
 * play/pause and (optional) scroll-snapping as the user moves through the page.
 *
 * Both the active-section state and the header theme are driven entirely by
 * IntersectionObserver — there is no scroll listener. The theme observer in
 * particular replaces a previous scroll handler that called
 * getBoundingClientRect() on every theme section per scroll tick (a forced-
 * reflow / layout-thrashing hotspot).
 */

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

// Cache DOM elements.
const sections = document.querySelectorAll(selectors.sectionObserve);
const header = document.querySelector(selectors.header);
const logoByline = document.querySelector(selectors.logoByline);
const themeSections = Array.from(document.querySelectorAll(selectors.themeSection));

const setTheme = (theme) => {
  if (theme && header) {
    header.setAttribute('data-theme', theme);
  }
};

const playVideo = async (video, section) => {
  try {
    await video.play();
    section.classList.add('is-playing');
    header?.classList.add('is-playing');
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

const handleActiveSection = (section) => {
  section.classList.add('is-active');

  // Hide the logo byline once we leave the intro section.
  if (logoByline && !section.matches(selectors.sectionIntro)) {
    logoByline.classList.add('hidden');
  }

  const video = section.querySelector(selectors.video);
  if (video) {
    playVideo(video, section);
  } else if (section.matches(selectors.sectionIntro)) {
    // Image intro: there is no video to trigger the reveal, so apply the
    // `is-playing` class directly. This drives the same intro fade-in
    // animations (header, menu, title) that playVideo() would.
    section.classList.add('is-playing');
    header?.classList.add('is-playing');
  }
};

const initIntersectionObserver = () => {
  currentSection = sections[0];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (currentSection && entry.target !== currentSection) {
        pauseVideo(currentSection);
      }

      if (entry.target !== currentSection && entry.target.hasAttribute('data-section-snap')) {
        entry.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      handleActiveSection(entry.target);
      currentSection = entry.target;
    });
  }, { threshold: 0.25 });

  sections.forEach((section) => observer.observe(section));
};

/**
 * Header theme observer.
 *
 * A degenerate root band pinned to the very top of the viewport
 * (`rootMargin: '0px 0px -100% 0px'`) means exactly the theme section currently
 * crossing the top edge is reported as intersecting — i.e. the section sitting
 * under the header. Whichever theme section is at the top wins, regardless of
 * scroll direction, with no per-scroll layout reads.
 *
 * We track the intersecting sections in a Map keyed on the top offset that the
 * IntersectionObserver entry already provides (`boundingClientRect.top`, which
 * does NOT force a reflow). At a section boundary the topmost crossing section
 * wins.
 */
const initThemeObserver = () => {
  const intersecting = new Map();

  const applyTopmostTheme = () => {
    let active = null;
    let activeTop = -Infinity;

    for (const [section, top] of intersecting) {
      if (top > activeTop) {
        activeTop = top;
        active = section;
      }
    }

    if (active) {
      setTheme(active.getAttribute('data-section-theme'));
    }
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        intersecting.set(entry.target, entry.boundingClientRect.top);
      } else {
        intersecting.delete(entry.target);
      }
    }
    applyTopmostTheme();
  }, { rootMargin: '0px 0px -100% 0px', threshold: 0 });

  themeSections.forEach((section) => observer.observe(section));
};

const handleOnLoad = () => {
  if (window.location.hash && header) {
    header.classList.add('prevent-animation');
  }
};

handleOnLoad();

if (sections.length > 0) {
  initIntersectionObserver();
}

if (themeSections.length > 0) {
  initThemeObserver();
}
