const consent = window.NightnurseConsent;
const banner = document.querySelector('[data-consent-banner]');
let opener;
const showSettings = (visible, focus = true) => {
  if (!banner) return;
  banner.querySelector('[data-consent-summary]').hidden = visible;
  banner.querySelector('[data-consent-settings]').hidden = !visible;
  const button = banner.querySelector('[data-consent-settings-open]');
  button.setAttribute('aria-expanded', String(visible));
  if (focus) (visible ? banner.querySelector('[data-consent-category]') : button).focus();
};
const open = (button, settings = true) => {
  if (!banner || !consent) return;
  opener = button;
  const current = consent.get();
  // Draft choices only: optional services stay blocked until the visitor saves.
  banner.querySelectorAll('[data-consent-category]').forEach(input => {
    input.checked = consent.decided() ? current[input.dataset.consentCategory] : true;
  });
  showSettings(settings, false);
  banner.hidden = false;
  if (button) banner.focus();
};
const close = () => { if (banner) banner.hidden = true; opener?.focus(); };
const save = (value) => { consent?.save(value); close(); };
document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest('[data-consent-open]')) open(target.closest('[data-consent-open]'));
  if (target?.closest('[data-consent-settings-open]')) showSettings(true);
  if (target?.closest('[data-consent-accept]')) save({ analytics: true, marketing: true, external: true });
  if (target?.closest('[data-consent-save]')) {
    const value = {};
    banner.querySelectorAll('[data-consent-category]').forEach(input => { value[input.dataset.consentCategory] = input.checked; });
    save(value);
  }
});
banner?.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (consent?.decided()) close();
  else showSettings(false);
});
if (consent && !consent.decided()) open(undefined, false);
window.addEventListener('nn:open-consent', () => open(document.activeElement));

const activateEmbeds = () => {
  if (!consent?.get().external) return;
  document.querySelectorAll('template[data-external-content]').forEach(template => {
    if (template.dataset.loaded) return;
    template.dataset.loaded = 'true';
    template.parentElement.querySelector('[data-external-placeholder]')?.remove();
    template.after(template.content.cloneNode(true));
  });
};
window.addEventListener('nn:consent', activateEmbeds);
activateEmbeds();

// Capture contact intent before link handlers (for example dialler extensions) stop bubbling.
// Delegate from the link, including SVG paths and translated text. No form fields.
document.addEventListener('click', event => {
  if (!consent?.get().analytics) return;
  const target = event.target instanceof Element ? event.target : null;
  const link = target?.closest('a');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  const name = link.matches('[data-tracking="consultation"]') ? 'nn_consultation_click'
    : href.startsWith('mailto:') ? 'nn_email_click' : href.startsWith('tel:') ? 'nn_phone_click' : null;
  if (name) window.dataLayer.push({ event: name });
}, true);

let checking = false;
const confirmContact = async () => {
  if (checking || !consent?.get().analytics || !['/kontakt/vielen-dank', '/en/contact/thank-you'].includes(location.pathname.replace(/\/$/, ''))) return;
  checking = true;
  try {
    const response = await fetch('/tracking/contact-success', {
      credentials: 'same-origin', cache: 'no-store', headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    if (!response.ok) return;
    const result = await response.json();
    if (result.confirmed && consent.get().analytics) window.dataLayer.push({ event: 'nn_contact_confirmed', form_id: 'contact_form', form_language: document.documentElement.lang });
  } catch (error) { /* Tracking failure must never affect a form. */ }
};
window.addEventListener('nn:consent', confirmContact);
confirmContact();
