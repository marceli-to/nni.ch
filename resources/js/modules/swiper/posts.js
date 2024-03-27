import debounce from '../debounce.js';
import Swiper from 'swiper';
import 'swiper/css';

(function () {

  let swiper;

  const selectors = {
    swiper: '.js-swiper-posts',
  };

  const opts = {
    direction: 'horizontal',
    slidesPerView: "auto",
    speed: 600,
    loop: false,
    lazy: true,
    spaceBetween: 20,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    }
  };

  const maxScreenWidth = 768;

  const init = () => {
    if (window.innerWidth < maxScreenWidth) {
      initSwiper();
    }

    window.addEventListener('resize', debounce(handleResize, 50), { passive: true });
  };

  const handleResize = () => {
    if (window.innerWidth < maxScreenWidth) {
      initSwiper();
    } 
    else if (window.innerWidth >= maxScreenWidth) {
      destroySwiper();
    }
  };

  const initSwiper = () => {
    if (document.querySelector(selectors.swiper)) {
      swiper = new Swiper(selectors.swiper, opts);
    }
  };

  const destroySwiper = () => {
    if (swiper) {
      swiper.destroy(true, true);
    }
  };

  init();

})();