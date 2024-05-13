import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

(function () {

  let swiper;

  const selectors = {
    swiper: '.js-swiper-expertise',
  };

  const opts = {
    direction: 'horizontal',
    speed: 600,
    loop: true,
    lazy: true,
    spaceBetween: 0,
    mousewheel: true,
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