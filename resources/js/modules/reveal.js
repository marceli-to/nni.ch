/**
 * Per-element scroll reveal.
 *
 * observer.js reveals a whole section at once, which is right for the page
 * builder blocks but wrong for a long listing: the portfolio is one section, so
 * every teaser would animate together. Each `[data-reveal]` is observed on its
 * own here and then left alone.
 *
 * The initial state lives in css/animations/reveal.css and hides the element,
 * so if IntersectionObserver is missing everything is revealed immediately
 * rather than staying invisible.
 */

const selector = '[data-reveal]';
const revealedClass = 'is-revealed';

const items = document.querySelectorAll(selector);

if (items.length > 0) {
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add(revealedClass));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add(revealedClass);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

    items.forEach((item) => observer.observe(item));
  }
}
