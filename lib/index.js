'use babel';
/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown
 * @fileoverview Linter.
 */

const Configuration = require('remark/lib/cli/configuration.js');

/* Lazy loading these */
let remark = null;
let lint = null;

/**
 * Linter-markdown.
 *
 * @return {LinterConfiguration}
 */
function linter() {
  const CODE_EXPRESSION = /`([^`]+)`/g;

  /**
   * Transform a (stringified) vfile range to a linter
   * nested-tuple.
   *
   * @param {Object} location - Positional information.
   * @return {Array.<Array.<number>>} - Linter range.
   */
  function toRange(location) {
    const result = [[
      Number(location.start.line) - 1,
      Number(location.start.column) - 1
    ]];

    result[1] = [
      location.end.line ? Number(location.end.line) - 1 : result[0][0],
      location.end.column ? Number(location.end.column) - 1 : result[0][1]
    ];

    return result;
  }

  /**
   * Transform a reason for warning from remark into
   * pretty HTML.
   *
   * @param {string} reason - Messsage in plain-text.
   * @return {string} - Messsage in HTML.
   */
  function toHTML(reason) {
    return reason.replace(CODE_EXPRESSION, '<code>$1</code>');
  }

  /**
   * Transform VFile messages
   * nested-tuple.
   *
   * @see https://github.com/wooorm/vfile#vfilemessage
   *
   * @param {VFileMessage} message - Virtual file error.
   * @return {Object} - Linter error.
   */
  function transform(message) {
    const reason = toHTML(message.reason);

    return {
      type: 'Error',
      html: `<span class="badge badge-flexible">${message.ruleId}</span> ${reason}`,
      filePath: this.getPath(),
      range: toRange(message.location)
    };
  }

  /**
   * Handle on-the-fly or on-save (depending on the
   * global atom-linter settings) events. Yeah!
   *
   * Loads `remark` on first invocation.
   *
   * @see https://github.com/atom-community/linter/wiki/Linter-API#messages
   *
   * @param {AtomTextEditor} editor - Access to editor.
   * @return {Promise.<Message, Error>} - Promise
   *  resolved with a list of linter-errors or an error.
   */
  function onchange(editor) {
    const filePath = editor.getPath();

    if (!filePath) {
      return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
      let config;

      if (!remark) {
        remark = require('remark');
        lint = require('remark-lint');
      }

      config = new Configuration({ detectRC: true });

      config.getConfiguration(filePath, (err, conf) => {
        let plugins;

        if (err) {
          return resolve([{
            type: 'Error',
            text: err.message,
            filePath,
            range: [[0, 0], [0, 0]]
          }]);
        }

        plugins = conf.plugins || {};
        plugins = plugins['remark-lint'] || plugins.lint;

        /* Load processor for current path */

        remark()
          .use(lint, plugins)
          .process(editor.getText(), conf.settings, (err2, file) => {
            if (err2) {
              reject(err2);
            }

            resolve(file.messages.map(transform, editor));
          });
      });
    });
  }

  return {
    grammarScopes: ['source.gfm', 'source.pfm', 'text.md'],
    name: 'remark-lint',
    scope: 'file',
    lintOnFly: true,
    lint: onchange
  };
}

/**
 * Run package activation tasks.
 */
function activate() {
  require('atom-package-deps').install();
}

/*
 * Expose.
 */
module.exports = {
  activate,
  config: {},
  provideLinter: linter
};
