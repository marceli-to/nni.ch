(function () {

  const selectors = {
    slides: '[data-slide]',
    slideButtons: '[data-slides-nav] a',
  };

  const init = () => {
    const buttons = document.querySelectorAll(selectors.slideButtons);
    if (buttons) {
      buttons.forEach((button) => {
        button.addEventListener('click', handleClick);
      });
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const slug = e.currentTarget.dataset.slideButton;
    const slides = document.querySelectorAll(selectors.slides);
    slides.forEach((slide) => {
      slide.classList.add('hidden');
    });
    // show the clicked slide
    const clickedSlide = document.querySelector(`[data-slide="${slug}"]`);
    clickedSlide.classList.remove('hidden');
    clickedSlide.classList.add('visible');
  };  

  init();
})();