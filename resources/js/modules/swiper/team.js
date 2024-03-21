import debounce from '../debounce.js';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


(function () {

  let swiper;

  const selectors = {
    swiper: '.js-swiper-team',
    btns: {
      prev: '.swiper-btn-prev',
      next: '.swiper-btn-next',
    }
  };

  const opts = {
    direction: 'horizontal',
    slidesPerView: "auto",
    loop: true,
    lazy: true,
    autoplay: {
      delay: 6000,
    },
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-btn-next',
      prevEl: '.swiper-btn-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      }
    }
  };

  const maxScreenWidth = 768;

  const init = () => {
    initSwiper();
  };


  const initSwiper = () => {
    if (document.querySelector(selectors.swiper)) {
      swiper = new Swiper(selectors.swiper, opts);
      // add click event to the buttons
      document.querySelector(selectors.btns.prev).addEventListener('click', () => swiper.slidePrev());
      document.querySelector(selectors.btns.next).addEventListener('click', () => swiper.slideNext());
    }
  };

  const destroySwiper = () => {
    if (swiper) {
      swiper.destroy(true, true);
    }
  };

  init();

})();