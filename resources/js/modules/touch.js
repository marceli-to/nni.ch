(function () {

  const selectors = {
    touch: '[data-touch]'
  };

  const init = () => {
    const touchElements = Array.from(document.querySelectorAll(selectors.touch));
    touchElements.forEach((element) => {
      element.addEventListener('touchstart', () => {
        alert('touchstart');
        element.classList.add('has-touch');
      });

      element.addEventListener('touchend', () => {
        element.classList.remove('has-touch');
      });
    });
  };

  init();
})();
