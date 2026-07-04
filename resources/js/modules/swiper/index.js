import Swiper from 'swiper';
import 'swiper/css';
import debounce from '../debounce.js';

/**
 * Config-driven Swiper factory.
 *
 * Replaces the previously duplicated per-slider modules (posts, projects,
 * team, images). Each slider is declared once in `sliders` below; the shared
 * `createSwiper` handles instantiation, responsive teardown and the manual
 * prev/next buttons.
 *
 * Note: the Navigation module is intentionally NOT registered. The nav buttons
 * are wired manually (see `bindNavigation`) — registering the module would make
 * Swiper handle the same clicks and advance the slider twice.
 */

const MOBILE_MAX = 768;

// Options shared by every slider; per-slider configs override as needed.
const baseOptions = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  centeredSlides: true,
  speed: 600,
  loop: false,
  lazy: true,
  spaceBetween: 20,
};

/**
 * Wire the manual prev/next buttons that sit as siblings of the `.swiper`
 * element (see partials/components/swiper/container).
 */
const bindNavigation = (swiper, el) => {
  const scope = el.parentElement ?? document;

  scope.querySelector('.swiper-btn-prev')?.addEventListener('click', (e) => {
    e.preventDefault();
    swiper.slidePrev();
  });

  scope.querySelector('.swiper-btn-next')?.addEventListener('click', (e) => {
    e.preventDefault();
    swiper.slideNext();
  });
};

/**
 * @param {string} selector
 * @param {object}   config
 * @param {object|((el: Element) => object)} config.options  Swiper options, or a factory per element.
 * @param {boolean} [config.responsive]  Init only below MOBILE_MAX, destroy at/above it.
 * @param {boolean} [config.navigation]  Wire manual prev/next buttons for each instance.
 */
const createSwiper = (selector, { options, responsive = false, navigation = false } = {}) => {
  const elements = [...document.querySelectorAll(selector)];
  if (elements.length === 0) return;

  const instances = new Map();
  const resolveOptions = (el) => (typeof options === 'function' ? options(el) : options);

  const create = () => {
    for (const el of elements) {
      if (instances.has(el)) continue;
      const swiper = new Swiper(el, resolveOptions(el));
      instances.set(el, swiper);
      if (navigation) bindNavigation(swiper, el);
    }
  };

  const destroy = () => {
    for (const swiper of instances.values()) swiper.destroy(true, true);
    instances.clear();
  };

  if (!responsive) {
    create();
    return;
  }

  const sync = () => (window.innerWidth < MOBILE_MAX ? create() : destroy());
  sync();
  window.addEventListener('resize', debounce(sync, 50), { passive: true });
};

// --- Slider declarations -----------------------------------------------------

createSwiper('.js-swiper-posts', {
  responsive: true,
  options: {
    ...baseOptions,
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 20 },
    },
  },
});

createSwiper('.js-swiper-projects', {
  responsive: true,
  options: {
    ...baseOptions,
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 50 },
    },
  },
});

createSwiper('.js-swiper-team', {
  navigation: true,
  options: {
    ...baseOptions,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
      1024: { slidesPerView: 3, spaceBetween: 30, centeredSlides: false },
      1280: { slidesPerView: 3, spaceBetween: 50, centeredSlides: false },
    },
  },
});

createSwiper('.js-swiper-images', {
  navigation: true,
  options: (el) => ({
    ...baseOptions,
    loop: el.querySelectorAll('.swiper-slide').length > 2,
    breakpoints: {
      768: { spaceBetween: 0 },
    },
  }),
});
