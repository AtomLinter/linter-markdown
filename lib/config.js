'use babel';
/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown:config
 * @fileoverview Configuration loaded into the engine.
 */

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
const CompositeDisposable = require('atom').CompositeDisposable;
const path = require('path');

const consistent = require.resolve('remark-preset-lint-consistent');
const recommended = require.resolve('remark-preset-lint-recommended');

let subscriptions;
let presetConsistentWithoutConfig;
let presetRecommendedWithoutConfig;

function configure(config) {
  const current = config.plugins || {};
  const plugins = {};
  const presets = [];
  let configured;

  Object.keys(current).forEach(filePath => {
    if (
      path.basename(path.dirname(filePath)) === 'remark-lint' ||
      filePath === 'remark-lint' ||
      filePath === 'lint'
    ) {
      configured = true;
    } else {
      /* Turn off other plug-ins. */
      plugins[filePath] = false;
    }
  });

  /* Found no config for `remark-lint`, set presets. */
  if (!configured) {
    if (presetRecommendedWithoutConfig) {
      presets.push(recommended);
    }

    if (presetConsistentWithoutConfig) {
      presets.push(consistent);
    }
  }

  return { presets, plugins };
}

function on() {
  subscriptions = new CompositeDisposable();

  subscriptions.add(atom.config.observe('linter-markdown.presetRecommendedWithoutConfig', value => {
    presetRecommendedWithoutConfig = value;
  }));

  subscriptions.add(atom.config.observe('linter-markdown.presetConsistentWithoutConfig', value => {
    presetConsistentWithoutConfig = value;
  }));
}

function off() {
  subscriptions.dispose();
}

module.exports = configure;

configure.on = on;
configure.off = off;
