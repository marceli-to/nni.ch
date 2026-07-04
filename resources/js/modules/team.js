/**
 * Category filter: clicking a [data-filter] term shows/hides the
 * [data-filter-category] items whose categories include that term.
 * The term "all" reveals everything.
 */

const selectors = {
  filterTerm: '[data-filter]',
  filterItem: '[data-filter-category]',
};

const filter = (e) => {
  e.preventDefault();
  const term = e.currentTarget.dataset.filter;

  document.querySelectorAll(selectors.filterItem).forEach((el) => {
    const show = term === 'all' || el.dataset.filterCategory.includes(term);
    el.classList.toggle('hidden', !show);
  });
};

document.querySelectorAll(selectors.filterTerm).forEach((el) => {
  el.addEventListener('click', filter);
});
