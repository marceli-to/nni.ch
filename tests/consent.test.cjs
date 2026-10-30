const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const head = fs.readFileSync(path.join(root, 'resources/views/partials/layout/consent.antlers.html'), 'utf8').replace(/<script[^>]*>|<\/script>/g, '');
const ui = fs.readFileSync(path.join(root, 'resources/js/gdpr.js'), 'utf8');

function environment(saved = null, options = {}) {
  const scripts = [], listeners = {}, clicks = [], requests = [];
  const storage = new Map([['nightnurse_consent_v1', saved], ['global_consent', 'true']]);
  let reloads = 0;
  class Element {}
  const categories = ['analytics', 'marketing', 'external'].map(category => ({
    dataset: { consentCategory: category }, checked: false, focus() {},
  }));
  const summary = {}, settings = {}, settingsButton = { setAttribute() {}, focus() {} };
  const banner = options.banner ? {
    hidden: true, focus() {}, addEventListener() {},
    querySelector: selector => ({
      '[data-consent-summary]': summary, '[data-consent-settings]': settings,
      '[data-consent-settings-open]': settingsButton, '[data-consent-category]': categories[0],
    })[selector],
    querySelectorAll: () => categories,
  } : null;
  const window = {
    localStorage: {
      getItem: key => { if (options.blockStorage) throw Error('blocked'); return storage.get(key); },
      setItem: (key, value) => { if (options.blockStorage) throw Error('blocked'); storage.set(key, value); }
    },
    location: { pathname: options.pathname || '/', reload: () => reloads++ },
    addEventListener: (name, cb) => (listeners[name] ||= []).push(cb),
    dispatchEvent: event => (listeners[event.type] || []).forEach(cb => cb(event)),
  };
  const document = {
    head: { appendChild: script => scripts.push(script) },
    createElement: () => ({}), querySelector: () => banner, querySelectorAll: () => [],
    documentElement: { lang: options.lang || 'de' },
    addEventListener: (name, cb) => { if (name === 'click') clicks.push(cb); },
  };
  const context = vm.createContext({
    window, document, Element, location: window.location, console,
    CustomEvent: class { constructor(type, init) { this.type = type; Object.assign(this, init); } },
    fetch: async (url, init) => { requests.push({ url, init }); return { ok: true, json: async () => ({ confirmed: options.confirmed === true }) }; },
  });
  vm.runInContext(head, context);
  if (options.ui) vm.runInContext(ui, context);
  const click = selector => {
    const target = new Element();
    target.closest = value => value === selector ? target : null;
    target.focus = () => {};
    clicks.forEach(cb => cb({ target }));
  };
  return { window, scripts, requests, storage, Element, clicks, click, banner, categories, summary, settings, get reloads() { return reloads; } };
}
const stored = (value, at = Date.now()) => JSON.stringify({ version: 1, at, analytics: false, marketing: false, external: false, ...value });
const events = env => env.window.dataLayer.filter(item => item.event).map(item => item.event);
const settle = () => new Promise(resolve => setImmediate(resolve));

test('initial checked settings are only a draft and do not grant consent', () => {
  const env = environment(null, { ui: true, banner: true });
  assert.equal(env.summary.hidden, false);
  assert.equal(env.settings.hidden, true);
  env.click('[data-consent-settings-open]');
  assert.equal(env.summary.hidden, true);
  assert.equal(env.settings.hidden, false);
  assert.ok(env.categories.every(input => input.checked));
  assert.equal(env.window.NightnurseConsent.decided(), false);
  assert.equal(env.window.NightnurseConsent.get().external, false);
  assert.equal(env.scripts.length, 0);
});

test('saving unchecked categories rejects them and reopening preserves the saved choice', () => {
  const env = environment(null, { ui: true, banner: true });
  env.click('[data-consent-settings-open]');
  env.categories.forEach(input => { input.checked = false; });
  env.click('[data-consent-save]');
  assert.equal(env.banner.hidden, true);
  assert.equal(env.window.NightnurseConsent.decided(), true);
  assert.equal(env.scripts.length, 0);
  env.click('[data-consent-open]');
  assert.ok(env.categories.every(input => !input.checked));
});

test('returning visitors retain their individual choices in settings', () => {
  const env = environment(stored({ external: true }), { ui: true, banner: true });
  env.click('[data-consent-open]');
  assert.deepEqual(env.categories.map(input => input.checked), [false, false, true]);
  assert.equal(env.scripts.length, 0);
});

test('first visit ignores legacy dismissal and loads no optional tag', () => {
  const env = environment();
  assert.equal(env.window.NightnurseConsent.decided(), false);
  assert.equal(env.scripts.length, 0);
  assert.equal(env.window.dataLayer[0][0], 'consent');
  assert.equal(env.window.dataLayer[0][1], 'default');
  for (const key of ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(env.window.dataLayer[0][2][key], 'denied');
});

test('malformed, expired and future decisions grant no consent', () => {
  for (const saved of ['invalid', stored({ analytics: true }, 0), stored({ analytics: true }, Date.now() + 999999), stored({ analytics: 'yes' })]) {
    assert.equal(environment(saved).scripts.length, 0);
  }
});

test('reject all remains functional with storage blocked', () => {
  const env = environment(null, { blockStorage: true });
  env.window.NightnurseConsent.save({});
  assert.equal(env.scripts.length, 0);
  assert.equal(env.window.NightnurseConsent.decided(), true);
});

test('saved partial consent precedes GTM load and keeps advertising denied', () => {
  const env = environment(stored({ analytics: true }));
  assert.equal(env.scripts.length, 1);
  assert.equal(env.window.dataLayer[1][1], 'update');
  assert.equal(env.window.dataLayer[1][2].ad_storage, 'denied');
  assert.ok(events(env).includes('nn_analytics_consent'));
  assert.ok(!events(env).includes('nn_marketing_consent'));
});

test('marketing-only then analytics grants fire distinct category events once', () => {
  const env = environment();
  env.window.NightnurseConsent.save({ marketing: true });
  assert.ok(!events(env).includes('nn_analytics_consent'));
  env.window.NightnurseConsent.save({ marketing: true, analytics: true });
  env.window.NightnurseConsent.save({ marketing: true, analytics: true });
  assert.equal(env.scripts.length, 1);
  assert.equal(events(env).filter(name => name === 'nn_analytics_consent').length, 1);
});

test('revocation updates consent before reloading to unload third parties', () => {
  const env = environment(stored({ analytics: true, marketing: true }));
  env.window.NightnurseConsent.save({});
  assert.equal(env.reloads, 1);
  assert.equal(env.window.dataLayer.filter(item => item[0] === 'consent').at(-1)[2].analytics_storage, 'denied');
  assert.equal(JSON.parse(env.storage.get('nightnurse_consent_v1')).marketing, false);
});

test('external-only choice never loads measurement tags', () => {
  const env = environment();
  env.window.NightnurseConsent.save({ external: true });
  assert.equal(env.scripts.length, 0);
});

test('nested SVG/translated consultation click generates a single language-independent signal', () => {
  const env = environment(stored({ analytics: true }), { ui: true });
  const link = { getAttribute: () => '/en/contact', matches: selector => selector.includes('consultation') };
  const target = new env.Element();
  target.closest = selector => selector === 'a' ? link : null;
  env.clicks.forEach(cb => cb({ target }));
  assert.equal(events(env).filter(name => name === 'nn_consultation_click').length, 1);
});

test('denied analytics never requests a success signal or queues contact clicks', async () => {
  const env = environment(null, { ui: true, pathname: '/kontakt/vielen-dank', confirmed: true });
  await settle();
  assert.equal(env.requests.length, 0);
  assert.ok(!events(env).includes('nn_contact_confirmed'));
});

test('confirmed DE and EN success produces one event without personal fields', async () => {
  for (const [pathname, lang] of [['/kontakt/vielen-dank', 'de'], ['/en/contact/thank-you', 'en']]) {
    const env = environment(stored({ analytics: true }), { ui: true, pathname, lang, confirmed: true });
    await settle();
    env.window.NightnurseConsent.save({ analytics: true });
    await settle();
    assert.equal(env.requests.length, 1);
    const successes = env.window.dataLayer.filter(item => item.event === 'nn_contact_confirmed');
    assert.equal(successes.length, 1);
    assert.deepEqual(Object.keys(successes[0]).sort(), ['event', 'form_id', 'form_language']);
  }
});

test('direct thank-you visits do not create events; late permission can confirm a real submission', async () => {
  const direct = environment(stored({ analytics: true }), { ui: true, pathname: '/en/contact/thank-you' });
  await settle();
  assert.ok(!events(direct).includes('nn_contact_confirmed'));
  const late = environment(null, { ui: true, pathname: '/kontakt/vielen-dank', confirmed: true });
  late.window.NightnurseConsent.save({ analytics: true });
  await settle();
  assert.equal(events(late).filter(name => name === 'nn_contact_confirmed').length, 1);
});
