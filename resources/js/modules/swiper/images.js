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
      swiper = new Swiper(swiperEl, getOpts(slideCount));
      const wrapper = swiperEl.parentElement;
      const prevBtn = wrapper.querySelector(selectors.btns.prev);
      const nextBtn = wrapper.querySelector(selectors.btns.next);
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          swiper.slidePrev();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          swiper.slideNext();
        });
      }
    }
  };

  init();

})();