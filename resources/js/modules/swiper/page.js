// import debounce from '../debounce.js';
// import Swiper from 'swiper';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

(function () {

  let swiper;

  const selectors = {
    swiper: '.js-swiper-page',
  };

  const slides = document.getElementsByClassName('swiper-slide');
  const slidesLength = slides.length;

  const opts = {
    observer: true,  
    observeParents: true,
    speed: 1200,
    direction: 'vertical',
    mousewheel: true,
    // mousewheel: {
    //   enabled: true,
    //   releaseOnEdges: false
    // },
    // followFinger: false,
    // touchReleaseOnEdges: true,
    // longSwipes: false,
    // parallax: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      // renderBullet: (index, className) => {
      //   const value = 'text' || '';
      //   return '<span class=' + className + '>' + '<span class="s-label">' + value + '</span></span>';
      // }
    },
    
    on: {
      slideChange: (swiper) => {
        const {offsetTop} = swiper.el;
        window.pageYOffset !== offsetTop && window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      },
      slideChangeTransitionEnd: (swiper) => {
        const activeIndex = swiper.activeIndex;
        //swiper.params.mousewheel.releaseOnEdges = activeIndex === 0 || (activeIndex === slidesLength-1);
      }
    }
  };

  const init = () => {
    initSwiper();
  };

  const initSwiper = () => {
    if (document.querySelector(selectors.swiper)) {
      swiper = new Swiper(selectors.swiper, {
        direction: "vertical",
        followFinger: false,
        speed: 1200,
        slidesPerView: 1,
        spaceBetween: 0,
        mousewheel: {
          enabled: true,
        },
        keyboard: {
          enabled: true,
        },
        on: {
          slideChange: (swiper) => {
            // const {offsetTop} = swiper.el;
            // window.pageYOffset !== offsetTop && window.scrollTo({
            //   top: offsetTop,
            //   behavior: 'smooth'
            // });
          },
          slideChangeTransitionEnd: (swiper) => {
            const activeIndex = swiper.activeIndex;
            //swiper.params.mousewheel.releaseOnEdges = activeIndex === 0 || (activeIndex === slidesLength-1);
          }
        }
      });
      console.log('Swiper initialized');
    }
  };

  const destroySwiper = () => {
    if (swiper) {
      swiper.destroy(true, true);
    }
  };

  init();

})();