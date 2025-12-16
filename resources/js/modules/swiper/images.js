import debounce from '../debounce.js';
import Swiper from 'swiper';
import 'swiper/css';

(function () {

  let swiper;

  const selectors = {
    swiper: '.js-swiper-images',
    btns: {
      prev: '.swiper-btn-prev',
      next: '.swiper-btn-next',
    }
  };

  const getOpts = (slideCount) => ({
    direction: 'horizontal',
    slidesPerView: "auto",
    centeredSlides: true,
    speed: 600,
    loop: slideCount > 2,
    lazy: true,
    spaceBetween: 20,
    breakpoints: {
      768: {
        spaceBetween: 0,
      },
    }
  });

  const init = () => {
    initSwiper();
  };

  const initSwiper = () => {
    const swiperEl = document.querySelector(selectors.swiper);
    if (swiperEl) {
      const slideCount = swiperEl.querySelectorAll('.swiper-slide').length;
      swiper = new Swiper(selectors.swiper, getOpts(slideCount));
      const prevBtn = document.querySelector(selectors.btns.prev);
      const nextBtn = document.querySelector(selectors.btns.next);
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          swiper.slidePrev();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          swiper.slideNext();
        });
      }
    }
  };

  init();

})();