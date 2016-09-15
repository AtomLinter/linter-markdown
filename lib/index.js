'use babel';
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown
 * @fileoverview Linter.
 */

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */

const CompositeDisposable = require('atom').CompositeDisposable;
const path = require('path');
const config = require('./config');

let engine;
let processor;
let subscriptions;
let scopes;
let detectIgnore;

function lint(editor) {
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
  if (!engine) {
    engine = require('unified-engine-atom');
  }

  if (!processor) {
    processor = require('remark');
  }

  return {
    grammarScopes: scopes,
    name: 'remark-lint',
    scope: 'file',
    lintOnFly: true,
    lint
  };
}

function activate() {
  require('atom-package-deps').install('linter-markdown');

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
