(function () {
  
  const selectors = {
    filterTerm: '[data-filter]',
    filterItem: '[data-filter-category]',
  };

  const init = () => {
    document.querySelectorAll(selectors.filterTerm).forEach((el) => {
      el.addEventListener('click', filter);
    });
  };

  const filter = (e) => {
    e.preventDefault();
    const term = e.currentTarget.dataset.filter;
    const items = document.querySelectorAll(selectors.filterItem);

    items.forEach((el) => {
      if (term === 'all') {
        el.classList.remove('hidden');
        return;
      }
      if (el.dataset.filterCategory.includes(term)) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  // init it data-filter is present
  if (document.querySelector(selectors.filterTerm)) {
    init();
  }
})();
