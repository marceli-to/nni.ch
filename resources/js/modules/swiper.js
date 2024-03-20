import Swiper from 'swiper';
import 'swiper/css';

const swiper = new Swiper('.swiper', {
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
});