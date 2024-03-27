import Swiper from 'swiper';
import 'swiper/css';

(function () {

  let swiper;

  const selectors = {
    swiper: '.js-swiper-projects',
  };

  const opts = {
    direction: 'horizontal',
    slidesPerView: "auto",
    speed: 600,
    loop: true,
    lazy: true,
    autoplay: {
      delay: 6000,
    },
    spaceBetween: 20,
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

  const init = () => {
    initSwiper();
  };

  const initSwiper = () => {
    if (document.querySelector(selectors.swiper)) {
      swiper = new Swiper(selectors.swiper, opts);
    }
  };

  init();

})();