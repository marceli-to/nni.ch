/**
 * Simple tabbed slides: clicking a nav link ([data-slide-button="slug"])
 * hides every [data-slide] and reveals the one matching the slug.
 */

const selectors = {
  slides: '[data-slide]',
  navButtons: '[data-slides-nav] a',
};

const showSlide = (e) => {
  e.preventDefault();
  const slug = e.currentTarget.dataset.slideButton;

  document.querySelectorAll(selectors.slides).forEach((slide) => {
    slide.classList.add('hidden');
  });

  const target = document.querySelector(`[data-slide="${slug}"]`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('visible');
  }
};

document.querySelectorAll(selectors.navButtons).forEach((button) => {
  button.addEventListener('click', showSlide);
});
