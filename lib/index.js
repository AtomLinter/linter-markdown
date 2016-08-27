'use babel';
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown
 * @fileoverview Linter.
 */

const path = require('path');

let engine;
let processor;

/**
 * Linter-markdown.
 *
 * @return {LinterConfiguration}
 */
function linter() {
  const config = atom.config.get('linter-markdown');

  if (!engine) {
    engine = require('unified-engine-atom');
  }

  if (!processor) {
    processor = require('remark');
  }

  return {
    grammarScopes: config.scopes,
    name: 'remark-lint',
    scope: 'file',
    lintOnFly: true,
    lint: engine({
      processor,
      rcName: '.remarkrc',
      rcPath: path.resolve(__dirname, 'config.js'),
      packageField: 'remarkConfig',
      ignoreName: '.remarkignore',
      presetPrefix: 'remark-preset',
      pluginPrefix: 'remark',
      detectIgnore: config.detectIgnore
    })
  };
}

/**
 * Run package activation tasks.
 */
function activate() {
  require('atom-package-deps').install('linter-markdown');
}

/*
 * Expose.
 */
module.exports = {
  activate,
  provideLinter: linter,
  config: {
    detectIgnore: {
      title: 'Ignore files',
      description: 'Use `.remarkignore` files.',
      type: 'boolean',
      default: true
    },
    presetRecommendedWithoutConfig: {
      title: 'Bug-free by default',
      description: 'Use [remark-preset-lint-recommended](https://github.com/' +
        'wooorm/remark-lint/tree/master/packages/remark-preset-lint-recommended) ' +
        'if no **remark-lint** config is found.',
      type: 'boolean',
      default: true
    },
    presetConsistentWithoutConfig: {
      title: 'Consistency by default',
      description: 'Use [remark-preset-lint-consistent](https://github.com/' +
        'wooorm/remark-lint/tree/master/packages/remark-preset-lint-consistent) ' +
        'if no **remark-lint** config is found.',
      type: 'boolean',
      default: true
    },
    scopes: {
      title: 'Scopes',
      description: 'List of scopes for languages which will be checked ' +
        '(run `Editor: Log Cursor Scope` to determine the scopes for a file).',
      type: 'array',
      items: {
        type: 'string'
      },
      default: [
        'source.gfm',
        'source.pfm',
        'text.md'
      ]
    }
  }
};
