(function () {
  
  const selectors = {
    images: '[data-loop-image]',
    duration: '[data-loop-duration]',
  };

  let currentIndex = 0;
  let duration = 150;

  const images = document.querySelectorAll(selectors.images);

  const init = () => {
    const loadedCount = imagesLoaded(images);
    duration = document.querySelector(selectors.duration).dataset.loopDuration;

    if (loadedCount === images.length) {
      loopImages();
    }
  };

  const loopImages = () => {
    setInterval(() => {
      images[currentIndex].classList.add('hidden');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.remove('hidden');
    }, duration);
  };

  const imagesLoaded = (images) => {
    let count = 0;
    images.forEach((image) => {
      if (image.complete) {
        count++;
      } else {
        image.addEventListener('load', () => {
          count++;
          if (count === images.length) {
            loopImages();
          }
        });
        image.addEventListener('error', handleImageError);
      }
    });
    return count;
  };

  const handleImageError = (e) => {
    console.error('Image failed to load', e);
  };

  if (document.querySelector(selectors.images)) {
    init();
  }
})();
