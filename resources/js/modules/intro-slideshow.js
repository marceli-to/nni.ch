/**
 * Intro slideshow: cross-fades between the [data-intro-slide] frames inside a
 * [data-intro-slideshow] container. Slides start in a shuffled order and
 * autoplay on an interval. The fade itself is CSS (opacity transition on the
 * slide); this module only toggles which slide is active.
 */

const FADE_INTERVAL = 5000;

const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const createSlideshow = (container) => {
  const slides = shuffle([...container.querySelectorAll('[data-intro-slide]')]);
  if (slides.length === 0) return;

  const activate = (index) => {
    slides.forEach((slide, i) => slide.style.opacity = i === index ? '1' : '0');
  };

  let currentIndex = 0;
  activate(currentIndex);

  if (slides.length === 1) return;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    activate(currentIndex);
  }, FADE_INTERVAL);
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-intro-slideshow]').forEach(createSlideshow);
});
