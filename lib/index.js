'use babel';

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown
 * @fileoverview Linter.
 */

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';

const path = require('path');

// Internal variables
let engine;
let processor;
let subscriptions;
let recommendedWithoutConfig;
let consistentWithoutConfig;
let recommended;
let consistent;
const idleCallbacks = new Set();

// Settings
let scopes;
let detectIgnore;

function lint(editor) {
  let plugins = [];
  let defaultConfig;

  // Load required modules if not already handled by init
  if (!engine) {
    engine = require('unified-engine-atom');
  }
  if (!processor) {
    processor = require('remark');
  }

  if (recommendedWithoutConfig) {
    if (!recommended) {
      recommended = require('remark-preset-lint-recommended');
    }
    plugins.push(recommended);
  }

  if (consistentWithoutConfig) {
    if (!consistent) {
      consistent = require('remark-preset-lint-consistent');
    }
    plugins.push(consistent);
  }

  if (consistentWithoutConfig || recommendedWithoutConfig) {
    defaultConfig = {plugins: plugins};
  }

  return engine({
    processor,
    detectIgnore,
    defaultConfig,
    rcName: '.remarkrc',
    packageField: 'remarkConfig',
    ignoreName: '.remarkignore',
    pluginPrefix: 'remark'
  })(editor);
}

/**
 * Linter-markdown.
 *
 * @return {LinterConfiguration}
 */
function provideLinter() {
  return {
    grammarScopes: scopes,
    name: 'remark-lint',
    scope: 'file',
    lintsOnChange: true,
    lint
  };
}

function activate() {
  let callbackID;
  const installLinterMarkdownDeps = () => {
    idleCallbacks.delete(callbackID);

    // Install package dependencies
    if (!atom.inSpecMode()) {
      require('atom-package-deps').install('linter-markdown');
    }
    // Load required modules
    if (!engine) {
      engine = require('unified-engine-atom');
    }
    if (!processor) {
      processor = require('remark');
    }
  };

  // Defer this till an idle time as we don't need it immediately
  callbackID = window.requestIdleCallback(installLinterMarkdownDeps);
  idleCallbacks.add(callbackID);

  subscriptions = new CompositeDisposable();

  subscriptions.add(atom.config.observe('linter-markdown.presetRecommendedWithoutConfig', (value) => {
    recommendedWithoutConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.presetConsistentWithoutConfig', (value) => {
    consistentWithoutConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.scopes', (value) => {
    scopes = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.detectIgnore', (value) => {
    detectIgnore = value;
  }));
}

function deactivate() {
  idleCallbacks.forEach(callbackID => window.cancleIdleCallback(callbackID));
  idleCallbacks.clear();
  subscriptions.dispose();
}

/*
 * Expose.
 */
module.exports = {
  activate,
  deactivate,
  provideLinter
};
