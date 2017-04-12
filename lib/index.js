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
const config = require('./config');

// Internal variables
let engine;
let processor;
let subscriptions;
const idleCallbacks = new Set();

// Settings
let scopes;
let detectIgnore;

function lint(editor) {
  // Load required modules if not already handled by init
  if (!engine) {
    engine = require('unified-engine-atom');
  }
  if (!processor) {
    processor = require('remark');
  }

  return engine({
    processor,
    detectIgnore,
    rcName: '.remarkrc',
    rcPath: path.resolve(__dirname, 'config.js'),
    packageField: 'remarkConfig',
    ignoreName: '.remarkignore',
    presetPrefix: 'remark-preset',
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
    lintOnFly: true,
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

  subscriptions.add(atom.config.observe('linter-markdown.scopes', (value) => {
    scopes = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.detectIgnore', (value) => {
    detectIgnore = value;
  }));

  config.on();
}

function deactivate() {
  idleCallbacks.forEach(callbackID => window.cancleIdleCallback(callbackID));
  idleCallbacks.clear();
  subscriptions.dispose();

  config.off();
}

/*
 * Expose.
 */
module.exports = {
  activate,
  deactivate,
  provideLinter
};
