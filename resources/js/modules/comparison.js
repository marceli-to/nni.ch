/**
 * Before/after image comparison slider. Dragging the handle reveals more or
 * less of the "after" image via a clip-path, driven by pointer/touch position.
 */

class ImageComparison {
  constructor(container) {
    this.container = container;
    this.slider = container.querySelector('[data-comparison-slider]');
    this.beforeImage = container.querySelector('[data-comparison-before-image]');
    this.afterImage = container.querySelector('[data-comparison-after-image]');
    this.isDown = false;

    // Exit if required elements don't exist.
    if (!this.slider || !this.beforeImage || !this.afterImage) {
      console.warn('Required elements not found in container:', container);
      return;
    }

    this.bindEvents();
  }

  getPosition(event) {
    const isMouse = event.type.includes('mouse');
    return {
      x: isMouse ? event.pageX : event.touches[0].clientX,
      y: isMouse ? event.pageY : event.touches[0].clientY,
    };
  }

  handleMove = (event) => {
    if (!this.isDown) return;
    event.preventDefault();

    const containerRect = this.container.getBoundingClientRect();
    const { x } = this.getPosition(event);
    const offset = x - containerRect.left;
    const percentage = Math.min(Math.max((offset / containerRect.width) * 100, 0), 100);

    this.slider.style.left = `${percentage}%`;
    this.afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
  };

  handlePointerDown = () => {
    this.isDown = true;
    this.container.style.cursor = 'ew-resize';
  };

  handlePointerUp = () => {
    this.isDown = false;
    this.container.style.cursor = 'default';
  };

  bindEvents() {
    this.slider.addEventListener('mousedown', this.handlePointerDown);
    this.slider.addEventListener('touchstart', this.handlePointerDown);

    window.addEventListener('mouseup', this.handlePointerUp);
    window.addEventListener('touchend', this.handlePointerUp);

    this.container.addEventListener('mousemove', this.handleMove);
    this.container.addEventListener('touchmove', this.handleMove);
  }

  destroy() {
    this.slider.removeEventListener('mousedown', this.handlePointerDown);
    this.slider.removeEventListener('touchstart', this.handlePointerDown);
    window.removeEventListener('mouseup', this.handlePointerUp);
    window.removeEventListener('touchend', this.handlePointerUp);
    this.container.removeEventListener('mousemove', this.handleMove);
    this.container.removeEventListener('touchmove', this.handleMove);
  }
}

document.querySelectorAll('[data-comparison-slider-container]').forEach((container) => {
  new ImageComparison(container);
});
