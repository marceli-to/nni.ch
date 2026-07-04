/**
 * GDPR consent banner: shows the banner until the user accepts, then persists
 * consent in localStorage and removes the banner + button.
 */

const selectors = {
  btn: '[data-gdpr-btn]',
  banner: '[data-gdpr-banner]',
};

const accept = () => {
  localStorage.setItem('global_consent', 'true');
  document.querySelector(selectors.btn)?.remove();
  document.querySelector(selectors.banner)?.remove();
};

const btn = document.querySelector(selectors.btn);
const banner = document.querySelector(selectors.banner);

btn?.addEventListener('click', accept);

if (banner && !localStorage.getItem('global_consent')) {
  banner.classList.remove('hidden');
}
