// (function () {
//   // // Selectors
//   // const selectors = {
//   //   panels: '[data-snap-panel]',
//   // };

//   // // Debounce delay in milliseconds
//   // const debounceDelay = 100;

//   // const init = () => {
//   //   // Get all panels
//   //   const panels = Array.from(document.querySelectorAll(selectors.panels));

//   //   // Initialize a flag to prevent multiple scrolls to the same panel
//   //   let isScrollingToPanel = false;

//   //   // Listen for scroll events on the window, debounced
//   //   window.addEventListener('scroll', debounce(() => {
//   //     if (isScrollingToPanel) return;

//   //     // Check each panel to see if it is entering the viewport from the bottom
//   //     for (const panel of panels) {
//   //       if (isEnteringViewportFromBottom(panel)) {
//   //         isScrollingToPanel = true; // Set the flag to prevent multiple scrolls

//   //         // Scroll to the page so the panel is at the top of the viewport 
//   //         window.scrollTo({
//   //           top: panel.offsetTop,
//   //           behavior: 'smooth',
//   //         });
//   //         // Reset the flag after the scroll animation completes (assume 1 second for smooth scroll)
//   //         setTimeout(() => {
//   //           isScrollingToPanel = false;
//   //         }, 1000);
//   //         break; // Stop checking once the first panel entering from bottom is found and scrolled into view
//   //       }
//   //     }
//   //   }, debounceDelay));
//   // };

//   // Helper function to check if an element is entering the viewport from the bottom
//   // const isEnteringViewportFromBottom = (element) => {
//   //   const rect = element.getBoundingClientRect();
//   //   return rect.bottom > 0 && rect.top < window.innerHeight && rect.top > 0;
//   // };

//   // Debounce function to limit the rate at which a function is executed
//   // const debounce = (func, wait) => {
//   //   let timeout;
//   //   return function executedFunction(...args) {
//   //     clearTimeout(timeout);
//   //     timeout = setTimeout(() => {
//   //       func.apply(this, args);
//   //     }, wait);
//   //   };
//   // };

//   //init();
// })();