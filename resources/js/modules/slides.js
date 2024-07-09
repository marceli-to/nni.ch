(function() {
  // Select all articles (slides)
  const slides = document.querySelectorAll('[data-slide]');
  // Select all navigation links
  const navLinks = document.querySelectorAll('[data-slides-nav] a');

  // Function to show a specific slide
  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('hidden');
        slide.classList.add('visible');
      } else {
        slide.classList.add('hidden');
        slide.classList.remove('visible');
      }
    });
  }

  // Add click event listeners to navigation links
  navLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showSlide(index + 1); // +1 because the first slide is not in the nav
    });
  });

  // Initialize: show the first slide
  showSlide(0);
})();