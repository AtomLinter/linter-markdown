'use babel';
/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown:config
 * @fileoverview Configuration loaded into the engine.
 */

const path = require('path');

const consistent = require.resolve('remark-preset-lint-consistent');
const recommended = require.resolve('remark-preset-lint-recommended');

function configure(config) {
  const pkg = atom.config.get('linter-markdown');
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
    if (pkg.presetRecommendedWithoutConfig) {
      presets.push(recommended);
    }

    if (pkg.presetConsistentWithoutConfig) {
      presets.push(consistent);
    }
  }

  return { presets, plugins };
}

module.exports = configure;
