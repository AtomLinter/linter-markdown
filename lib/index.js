'use babel';
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown
 * @fileoverview Linter.
 */

const path = require('path');
const engine = require('unified-engine-atom');

/**
 * Linter-markdown.
 *
 * @return {LinterConfiguration}
 */
function linter() {
  return {
    grammarScopes: [
      'source.gfm',
      'source.pfm',
      'text.md'
    ],
    name: 'remark-lint',
    scope: 'file',
    lintOnFly: true,
    lint: engine({
      processor: require('remark'),
      rcName: '.remarkrc',
      rcPath: path.resolve(__dirname, 'config.js'),
      packageField: 'remarkConfig',
      ignoreName: '.remarkignore',
      pluginPrefix: 'remark'
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
  config: {},
  provideLinter: linter
};
