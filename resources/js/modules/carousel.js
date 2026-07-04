/**
 * Frame-by-frame image carousel: cycles through [data-carousel-image] frames
 * by toggling the `hidden` class on an interval, once every frame has loaded.
 * Each carousel is scoped by its [data-carousel="id"] container.
 */

const createCarousel = (container) => {
  const images = [...container.querySelectorAll('[data-carousel-image]')];
  if (images.length === 0) return;

  const duration = Number(container.querySelector('[data-carousel-duration]')?.dataset.carouselDuration) || 150;

  let currentIndex = 0;

  const loop = () => {
    setInterval(() => {
      images[currentIndex].classList.add('hidden');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.remove('hidden');
    }, duration);
  };

  // Start only once every frame has loaded, so the animation doesn't stutter.
  const pending = images.filter((image) => !image.complete);

  if (pending.length === 0) {
    loop();
    return;
  }

  let remaining = pending.length;
  pending.forEach((image) => {
    image.addEventListener('load', () => {
      remaining -= 1;
      if (remaining === 0) loop();
    });
    image.addEventListener('error', (e) => console.error('Image failed to load', e));
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-carousel]').forEach(createCarousel);
});
