(function() {
  'use strict';
  
  // Configuration
  const SCROLL_THRESHOLD = 100;
  const SELECTOR = '[data-quick-menu]';
  
  // State
  let lastScrollY = 0;
  let isScrolling = false;
  let quickMenu = null;
  
  // Initialize the scroll handler
  function init() {
    quickMenu = document.querySelector(SELECTOR);
    
    if (!quickMenu) {
      console.warn('Quick menu element not found with selector:', SELECTOR);
      return;
    }
    
    // Set initial styles for smooth transitions
    quickMenu.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    quickMenu.style.willChange = 'opacity, transform';
    
    // Add scroll event listener with throttling
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Initial call to set correct state
    handleScroll();
  }
  
  // Throttled scroll handler using requestAnimationFrame
  function throttledScrollHandler() {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
    }
  }
  
  // Main scroll handling logic
  function handleScroll() {
    if (!quickMenu) return;
    
    const currentScrollY = window.pageYOffset || window.scrollY;
    
    // Determine if we should hide the menu
    let shouldHide = false;
    
    if (currentScrollY > SCROLL_THRESHOLD) {
      // Only hide when scrolling down, show when scrolling up
      shouldHide = currentScrollY > lastScrollY;
    }
    // If we're above the threshold, always show (shouldHide remains false)
    
    // Apply the visibility change
    if (shouldHide) {
      hideMenu();
    } else {
      showMenu();
    }
    
    // Update last scroll position
    lastScrollY = currentScrollY;
  }
  
  // Hide the quick menu
  function hideMenu() {
    quickMenu.style.opacity = '0';
    quickMenu.style.transform = 'translateY(-8px)';
    quickMenu.style.pointerEvents = 'none';
    quickMenu.setAttribute('aria-hidden', 'true');
  }
  
  // Show the quick menu
  function showMenu() {
    quickMenu.style.opacity = '1';
    quickMenu.style.transform = 'translateY(0)';
    quickMenu.style.pointerEvents = 'auto';
    quickMenu.setAttribute('aria-hidden', 'false');
  }
  
  // Clean up function (optional, for SPA or dynamic content)
  function destroy() {
    if (quickMenu) {
      window.removeEventListener('scroll', throttledScrollHandler);
      quickMenu.style.transition = '';
      quickMenu.style.willChange = '';
      quickMenu.style.opacity = '';
      quickMenu.style.transform = '';
      quickMenu.style.pointerEvents = '';
      quickMenu.removeAttribute('aria-hidden');
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose destroy function globally if needed
  window.quickMenuScrollHandler = {
    destroy: destroy,
    init: init
  };
  
})();