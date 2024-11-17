(() => {
  const slider = document.querySelector('[data-comparison-slider]');
  const beforeImage = document.querySelector('[data-comparison-before-image]');
  const afterImage = document.querySelector('[data-comparison-after-image]');
  const container = document.querySelector('[data-comparison-slider-container]');

  let isDown = false;

  // Exit if required elements don't exist
  if (!slider || !beforeImage || !afterImage || !container) {
    return;
  }

  function getPosition(event) {
    return {
      x: event.type.includes('mouse') ? event.pageX : event.touches[0].clientX,
      y: event.type.includes('mouse') ? event.pageY : event.touches[0].clientY
    };
  }

  function handleMove(event) {
    if (!isDown) return;
    
    event.preventDefault();
    
    const containerRect = container.getBoundingClientRect();
    const pos = getPosition(event);
    const x = pos.x - containerRect.left;
    
    const percentage = Math.min(Math.max((x / containerRect.width) * 100, 0), 100);
    
    slider.style.left = `${percentage}%`;
    afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
  }

  slider.addEventListener('mousedown', () => {
    isDown = true;
    container.style.cursor = 'ew-resize';
  });

  slider.addEventListener('touchstart', () => {
    isDown = true;
    container.style.cursor = 'ew-resize';
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'default';
  });

  window.addEventListener('touchend', () => {
    isDown = false;
    container.style.cursor = 'default';
  });

  container.addEventListener('mousemove', handleMove);
  container.addEventListener('touchmove', handleMove);
})();