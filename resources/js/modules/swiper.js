import debounce from './_debounce.js';
import Swiper from 'swiper';
import 'swiper/css';

(function () {

  let swiper;

  const selectors = {
    swiper: '.swiper',
  };

  const opts = {
    direction: 'horizontal',
    slidesPerView: "auto",
    loop: true,
    autoplay: {
      delay: 6000,
    },
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    }
  };

  const maxScreenWidth = 768;

  const init = () => {
    if (document.querySelector(selectors.swiper) && window.innerWidth < maxScreenWidth) {
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
    swiper = new Swiper(selectors.swiper, opts);
  };

  const destroySwiper = () => {
    swiper.destroy(true, true);
  };

  init();

})();