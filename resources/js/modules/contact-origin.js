// First observed page and first UTM campaign of this tab's consented visit.
// Keep this in the browser: Statamic serves shared, statically cached pages.
const key = 'nightnurse_contact_origin_v1';
const maxAge = 30 * 60 * 1000;
const campaignKeys = ['utm_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const fields = ['origin_landing', 'origin_referrer', 'origin_campaign', 'origin_path'];
let visit = null;

function hasAnalyticsConsent() {
  // A back/forward-cached page may still hold the choice from before navigation.
  // Read the saved preference again; blocked storage keeps page-only consent.
  try {
    const saved = JSON.parse(window.localStorage.getItem('nightnurse_consent_v1'));
    if (saved) return saved.version === 1 && saved.at <= Date.now() &&
      Date.now() - saved.at < 180 * 86400000 &&
      ['analytics', 'marketing', 'external'].every(name => typeof saved[name] === 'boolean') && saved.analytics;
  } catch (error) { /* Use the consent API when preference storage is unavailable. */ }
  return window.NightnurseConsent?.get().analytics === true;
}

function clear() {
  visit = null;
  try { window.sessionStorage.removeItem(key); } catch (error) { /* Storage is optional. */ }
}

function load() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(key));
    if (saved && saved.at <= Date.now() && Date.now() - saved.at < maxAge &&
        typeof saved.landing === 'string' && typeof saved.referrer === 'string' &&
        typeof saved.campaign === 'string' && Array.isArray(saved.path) &&
        saved.path.length <= 20 && saved.path.every(page => typeof page === 'string')) return saved;
  } catch (error) { /* Corrupt or blocked storage must never affect the form. */ }
  return null;
}

function referrerHost() {
  try {
    const url = new URL(document.referrer);
    return /^https?:$/.test(url.protocol) && url.origin !== window.location.origin ? url.hostname : '';
  } catch (error) { return ''; }
}

function fill() {
  const values = visit ? [visit.landing, visit.referrer, visit.campaign, visit.path.join('\n')] : ['', '', '', ''];
  document.querySelectorAll('form.contact-form').forEach(form => {
    fields.forEach((name, index) => {
      const input = form.elements.namedItem(name);
      if (input) input.value = values[index];
    });
  });
}

function record() {
  const location = window.location;
  if (!hasAnalyticsConsent() ||
      /^\/(kontakt\/vielen-dank|en\/contact\/thank-you)\/?$/.test(location.pathname)) {
    clear();
    fill();
    return;
  }

  if (!visit || Date.now() - visit.at >= maxAge) visit = load();
  const page = location.pathname.slice(0, 500);
  visit ||= { landing: page, referrer: referrerHost(), campaign: '', path: [] };
  if (!visit.campaign) {
    const query = new URLSearchParams(location.search);
    const campaign = new URLSearchParams();
    campaignKeys.forEach(name => {
      const value = query.get(name);
      if (value) campaign.set(name, value.replace(/[\r\n\t]/g, ' ').slice(0, 100));
    });
    visit.campaign = campaign.toString();
  }
  if (visit.path.at(-1) !== page) visit.path.push(page);
  // The landing page remains separate when a long visit exceeds the limit.
  visit.path = visit.path.slice(-20);
  visit.at = Date.now();
  try { window.sessionStorage.setItem(key, JSON.stringify(visit)); } catch (error) { /* Page-only fallback. */ }
  fill();
}

window.addEventListener('nn:consent', record);
window.addEventListener('pageshow', () => {
  visit = null; // A restored page must use the current visit, including a cleared one.
  record();
});
document.addEventListener('submit', event => {
  if (event.target.matches('form.contact-form')) record();
}, true);
record();
