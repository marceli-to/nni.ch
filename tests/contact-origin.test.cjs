const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.resolve(__dirname, '../resources/js/modules/contact-origin.js'), 'utf8');
const key = 'nightnurse_contact_origin_v1';

function page(url, { storage = new Map(), analytics = true, blocked = false, referrer = '' } = {}) {
  const listeners = {}, inputs = {};
  let consent = analytics;
  let preference = analytics;
  const form = {
    matches: selector => selector === 'form.contact-form',
    elements: { namedItem: name => inputs[name] ||= { value: '' } },
  };
  const window = {
    location: new URL(url, 'https://nightnurse.test'),
    NightnurseConsent: { get: () => ({ analytics: consent }) },
    localStorage: {
      getItem: () => {
        if (blocked) throw Error('blocked');
        return JSON.stringify({ version: 1, at: Date.now(), analytics: preference, marketing: false, external: false });
      },
    },
    sessionStorage: {
      getItem: name => { if (blocked) throw Error('blocked'); return storage.get(name) ?? null; },
      setItem: (name, value) => { if (blocked) throw Error('blocked'); storage.set(name, value); },
      removeItem: name => { if (blocked) throw Error('blocked'); storage.delete(name); },
    },
    addEventListener: (name, cb) => listeners[name] = cb,
  };
  const document = {
    referrer,
    querySelectorAll: () => [form],
    addEventListener: (name, cb) => listeners[name] = cb,
  };
  vm.runInNewContext(source, { window, document, URL, URLSearchParams });
  return {
    storage, inputs,
    saved: () => JSON.parse(storage.get(key)),
    consent: value => { consent = preference = value; listeners['nn:consent'](); },
    submit: () => listeners.submit({ target: form }),
    restore: () => listeners.pageshow(),
    savedPreference: value => { preference = value; },
  };
}

test('DE and EN journeys retain landing, domain and first UTM campaign without other URL data', () => {
  for (const contact of ['/kontakt', '/en/contact']) {
    const landing = page('/leistungen?utm_id=42&utm_source=newsletter&utm_campaign=herbst&email=private#secret', {
      referrer: 'https://example.org/private?email=secret#token',
    });
    page('/projekte/haus', { storage: landing.storage });
    const end = page(`${contact}?utm_campaign=second`, { storage: landing.storage });
    assert.equal(end.inputs.origin_landing.value, '/leistungen');
    assert.equal(end.inputs.origin_referrer.value, 'example.org');
    assert.equal(end.inputs.origin_campaign.value, 'utm_id=42&utm_source=newsletter&utm_campaign=herbst');
    assert.equal(end.inputs.origin_path.value, `/leistungen\n/projekte/haus\n${contact}`);
    assert.ok(!JSON.stringify(end.saved()).includes('private'));
    end.submit();
    assert.equal(end.saved().path.length, 3);
  }
});

test('no recording before analytics consent; granting starts here and revoking clears fields and storage', () => {
  const env = page('/kontakt?utm_source=mail', { analytics: false });
  assert.equal(env.storage.size, 0);
  assert.ok(Object.values(env.inputs).every(input => input.value === ''));
  env.consent(true);
  assert.equal(env.inputs.origin_landing.value, '/kontakt');
  env.consent(false);
  env.submit();
  assert.equal(env.storage.size, 0);
  assert.ok(Object.values(env.inputs).every(input => input.value === ''));
});

test('blocked or corrupt storage does not break a submission', () => {
  const blocked = page('/en/contact', { blocked: true });
  blocked.submit();
  assert.equal(blocked.inputs.origin_path.value, '/en/contact');
  const storage = new Map([[key, '{broken']]);
  assert.equal(page('/kontakt', { storage }).saved().landing, '/kontakt');
});

test('expired visits reset and a long journey keeps landing separately from the last 20 pages', () => {
  const start = page('/start');
  for (let i = 0; i < 25; i++) page(`/project/${i}`, { storage: start.storage });
  const end = page('/kontakt', { storage: start.storage });
  assert.equal(end.saved().landing, '/start');
  assert.equal(end.saved().path.length, 20);
  const expired = { ...end.saved(), at: Date.now() - 31 * 60 * 1000 };
  end.storage.set(key, JSON.stringify(expired));
  assert.equal(page('/en/contact', { storage: end.storage }).saved().landing, '/en/contact');
});

test('both thank-you pages clear the visit and back/forward restoration does not resurrect it', () => {
  for (const thanks of ['/kontakt/vielen-dank', '/en/contact/thank-you']) {
    const env = page('/kontakt');
    page(thanks, { storage: env.storage });
    assert.equal(env.storage.size, 0);
    env.restore();
    assert.deepEqual(env.saved().path, ['/kontakt']);
  }
});

test('same-site referrers stay empty and only known campaign keys are retained', () => {
  const env = page('/kontakt?gclid=secret&utm_content=%3Cimg%3E&utm_term=hello%0Aworld', {
    referrer: 'https://nightnurse.test/internal?secret=1',
  });
  assert.equal(env.inputs.origin_referrer.value, '');
  assert.equal(env.inputs.origin_campaign.value, 'utm_content=%3Cimg%3E&utm_term=hello+world');
});

test('restoring an old page respects consent granted or revoked on another page', () => {
  const revoked = page('/kontakt');
  revoked.savedPreference(false);
  revoked.restore();
  revoked.submit();
  assert.equal(revoked.storage.size, 0);
  assert.ok(Object.values(revoked.inputs).every(input => input.value === ''));
  const granted = page('/en/contact', { analytics: false });
  granted.savedPreference(true);
  granted.restore();
  assert.equal(granted.inputs.origin_landing.value, '/en/contact');
});
