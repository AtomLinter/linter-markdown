'use babel';
/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown:config
 * @fileoverview Configuration loaded into the engine.
 */

const path = require('path');

const local = require.resolve('remark-lint');

function configure(config) {
  const current = config.plugins || {};
  const next = {};
  let found = false;

  Object.keys(current).forEach(key => {
    /* Turn off plug-ins. */
    next[key] = false;

    /* Keep remark-lint */
    if (path.basename(key) === 'remark-lint') {
      next[key] = current[key];
      found = true;
    }
  });

  /* Set local `remark-lint`. */
  if (!found) {
    next[local] = null;
  }

  return { plugins: next };
}

module.exports = configure;
