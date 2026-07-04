/**
 * Toggles a `has-touch` class on elements while they are being touched,
 * so styles can react to touch without relying on :hover on touch devices.
 */

if ('ontouchstart' in window) {
  document.querySelectorAll('[data-touch]').forEach((el) => {
    el.addEventListener('touchstart', () => el.classList.add('has-touch'));
    el.addEventListener('touchend', () => el.classList.remove('has-touch'));
  });
}
