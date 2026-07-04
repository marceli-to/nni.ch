/**
 * Quick menu: hides the floating menu when scrolling down past a threshold and
 * reveals it again when scrolling up. Scroll handling is throttled with rAF.
 */

const SCROLL_THRESHOLD = 100;
const SELECTOR = '[data-quick-menu]';

let lastScrollY = 0;
let isScrolling = false;
let quickMenu = null;

const hideMenu = () => {
  quickMenu.style.opacity = '0';
  quickMenu.style.transform = 'translateY(-8px)';
  quickMenu.style.pointerEvents = 'none';
  quickMenu.setAttribute('aria-hidden', 'true');
};

const showMenu = () => {
  quickMenu.style.opacity = '1';
  quickMenu.style.transform = 'translateY(0)';
  quickMenu.style.pointerEvents = 'auto';
  quickMenu.setAttribute('aria-hidden', 'false');
};

const handleScroll = () => {
  if (!quickMenu) return;

  const currentScrollY = window.scrollY;

  // Only hide while scrolling down past the threshold; otherwise show.
  const shouldHide = currentScrollY > SCROLL_THRESHOLD && currentScrollY > lastScrollY;

  if (shouldHide) hideMenu();
  else showMenu();

  lastScrollY = currentScrollY;
};

const throttledScrollHandler = () => {
  if (isScrolling) return;
  isScrolling = true;
  requestAnimationFrame(() => {
    handleScroll();
    isScrolling = false;
  });
};

const init = () => {
  quickMenu = document.querySelector(SELECTOR);

  if (!quickMenu) {
    console.warn('Quick menu element not found with selector:', SELECTOR);
    return;
  }

  // Set up smooth transitions for the show/hide states.
  quickMenu.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
  quickMenu.style.willChange = 'opacity, transform';

  window.addEventListener('scroll', throttledScrollHandler, { passive: true });

  handleScroll();
};

const destroy = () => {
  if (!quickMenu) return;
  window.removeEventListener('scroll', throttledScrollHandler);
  quickMenu.style.transition = '';
  quickMenu.style.willChange = '';
  quickMenu.style.opacity = '';
  quickMenu.style.transform = '';
  quickMenu.style.pointerEvents = '';
  quickMenu.removeAttribute('aria-hidden');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Exposed for manual teardown/re-init (e.g. dynamic content).
window.quickMenuScrollHandler = { init, destroy };
