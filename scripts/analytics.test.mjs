import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/portfolio-analytics.js', import.meta.url), 'utf8');

function browser(overrides = {}) {
  const handlers = {};
  const scripts = [];
  class Element {
    constructor(href, download = false) { this.href = href; this.download = download; }
    closest() { return this; }
    hasAttribute(name) { return name === 'download' && this.download; }
  }
  const context = vm.createContext({
    window: {}, URL, Element,
    location: new URL('https://ashwinchempolil.me/work'),
    document: {
      currentScript: { dataset: { key: 'phc_test', enabled: 'true', branch: 'test', ...overrides } },
      createElement: () => ({}),
      head: { appendChild: (script) => scripts.push(script) },
      addEventListener: (name, handler) => { (handlers[name] ??= []).push(handler); },
    },
  });
  const run = () => vm.runInContext(source, context);
  run();
  return {
    context, scripts, run,
    emit: (name, event) => handlers[name]?.forEach((handler) => handler(event)),
    click(href, download = false, type = 'click', button = 0) {
      this.emit(type, { type, button, target: new Element(href, download) });
    },
    events: () => context.window.posthog.filter((entry) => entry[0] === 'capture'),
  };
}

test('missing config, development and unsupported hosts do not load tracking', () => {
  for (const config of [{ key: '' }, { enabled: 'false' }, { host: 'https://example.com' }]) {
    const b = browser(config);
    assert.equal(b.scripts.length, 0);
    assert.equal(b.context.window.posthog, undefined);
  }
});

test('loads the matching regional SDK only once, even if Astro runs the script again', () => {
  const b = browser({ host: 'https://eu.i.posthog.com' });
  b.run();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].src, 'https://eu-assets.i.posthog.com/static/array.js');
  assert.equal(b.context.window.posthog._i.length, 1);
  b.click('/resume.pdf');
  assert.equal(b.events().length, 1);
});

test('SDK owns SPA pageviews; every event carries the branch label', () => {
  const b = browser();
  const [, options] = b.context.window.posthog._i[0];
  assert.equal(options.capture_pageview, 'history_change');
  assert.equal(options.capture_pageleave, true);
  assert.equal(options.disable_session_recording, undefined);
  assert.equal(options.autocapture, false);
  assert.equal(options.person_profiles, 'always');
  assert.equal(options.before_send({ properties: {} }).properties.site_branch, 'test');
  assert.equal(options.before_send(null), null);
  options.loaded(b.context.window.posthog);
  assert.equal(b.context.window.posthog[0][0], 'register');
});

test('email clicks never include the address or email body', () => {
  const b = browser();
  b.click('mailto:private@example.com?body=secret');
  assert.equal(b.events()[0][1], 'contact_clicked');
  assert.equal(b.events()[0][2].contact_method, 'email');
  assert.doesNotMatch(JSON.stringify(b.events()), /private|secret/);
});

test('tracks resume intent, outbound destinations and internal navigation', () => {
  const b = browser();
  b.click('/resume.pdf', true);
  b.click('/resume.pdf');
  b.click('https://github.com/ashwinjohn3?token=secret#private');
  b.click('/work');
  assert.equal(b.events()[0][2].action, 'download');
  assert.equal(b.events()[1][2].action, 'open');
  assert.equal(b.events()[2][1], 'outbound_link_clicked');
  assert.equal(b.events()[2][2].destination, 'https://github.com/ashwinjohn3');
  assert.equal(b.events()[3][1], 'navigation_clicked');
  assert.doesNotMatch(JSON.stringify(b.events()), /secret|private/);
});

test('captures middle clicks but ignores right clicks and non-web protocols', () => {
  const b = browser();
  b.click('https://github.com', false, 'auxclick', 1);
  b.click('https://github.com', false, 'auxclick', 2);
  b.click('javascript:void(0)');
  assert.equal(b.events().length, 1);
});

test('theme event uses the loaded SDK instead of the replaced loading queue', () => {
  const b = browser();
  const calls = [];
  b.context.window.posthog = { capture: (...args) => calls.push(args) };
  b.emit('portfolio:theme-changed', { detail: { theme: 'p1' } });
  assert.equal(calls[0][0], 'theme_changed');
  assert.equal(calls[0][1].theme, 'p1');
  assert.equal(calls[0][1].page_path, '/work');
});
