import Swiper from 'swiper';
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
    speed: 600,
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

  const init = () => {
    initSwiper();
  };


  const initSwiper = () => {
    if (document.querySelector(selectors.swiper)) {
      swiper = new Swiper(selectors.swiper, opts);
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

  const destroySwiper = () => {
    if (swiper) {
      swiper.destroy(true, true);
    }
  };

  init();

})();