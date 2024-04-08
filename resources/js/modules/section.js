(function () {
  const selectors = {
    section: '[data-section]',
  };

  const check = () => {
    let sections = document.querySelectorAll(selectors.section);

    if ("IntersectionObserver" in window) {
      let sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Do something with the section when it becomes visible

           // get data-section attribute
            const section = entry.target.getAttribute('data-section');
            const theme = entry.target.getAttribute('data-section-theme');
            // Unobserve the section if you only need to trigger once
            // observer.unobserve(entry.target);
          } else {
            // Do something when the section leaves the viewport
            // get the next section
            // const nextSection = entry.target.nextElementSibling;
            
          }
        });
      }, { threshold: 0.25 }); // Example threshold of 50%

      sections.forEach(section => {
        sectionObserver.observe(section);
      });
    }
  };

  check();
})();
