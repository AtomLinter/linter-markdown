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

// Internal variables
let engine;
let processor;
let subscriptions;
let yamlWithoutConfig;
let recommendedWithoutConfig;
let consistentWithoutConfig;
let styleGuideWithoutConfig;
let frontmatter;
let recommended;
let consistent;
let styleGuide;
const idleCallbacks = new Set();

// Settings
let scopes;
let detectIgnore;

function loadDeps() {
  if (!engine) {
    engine = require('unified-engine-atom');
  }
  if (!processor) {
    processor = require('remark');
  }
  if (!frontmatter) {
    frontmatter = require('remark-frontmatter');
  }
  if (!recommended) {
    recommended = require('remark-preset-lint-recommended');
  }
  if (!styleGuide) {
    styleGuide = require('remark-preset-lint-markdown-style-guide');
  }
  if (!consistent) {
    consistent = require('remark-preset-lint-consistent');
  }
}

function lint(editor) {
  const plugins = [];
  let defaultConfig;

  // Load required modules if not already handled by init
  loadDeps();

  if (yamlWithoutConfig) {
    plugins.push(frontmatter);
  }

  if (recommendedWithoutConfig) {
    plugins.push(recommended);
  }

  if (styleGuideWithoutConfig) {
    plugins.push(styleGuide);
  }

  if (consistentWithoutConfig) {
    plugins.push(consistent);
  }

  if (
    yamlWithoutConfig ||
    consistentWithoutConfig ||
    recommendedWithoutConfig ||
    styleGuideWithoutConfig
  ) {
    defaultConfig = { plugins };
  }

  return engine({
    processor,
    detectConfig: true,
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
    loadDeps();
  };

  // Defer this till an idle time as we don't need it immediately
  callbackID = window.requestIdleCallback(installLinterMarkdownDeps);
  idleCallbacks.add(callbackID);

  subscriptions = new CompositeDisposable();

  subscriptions.add(atom.config.observe('linter-markdown.yamlWithoutConfig', (value) => {
    yamlWithoutConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.presetRecommendedWithoutConfig', (value) => {
    recommendedWithoutConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.presetConsistentWithoutConfig', (value) => {
    consistentWithoutConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.presetStyleGuideWithoutConfig', (value) => {
    styleGuideWithoutConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.scopes', (value) => {
    scopes = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.detectIgnore', (value) => {
    detectIgnore = value;
  }));
}

function deactivate() {
  idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
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
