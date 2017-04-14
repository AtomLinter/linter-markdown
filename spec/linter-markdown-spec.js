'use babel';

import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { beforeEach, it } from 'jasmine-fix';
// NOTE: If using fit you must add it to the list above!

import * as lint from '..';

const validPath = path.join(__dirname, 'fixtures', 'definition-use-valid.md');
const invalidPath = path.join(__dirname, 'fixtures', 'definition-use-invalid.md');

describe('The remark-lint provider for Linter', () => {
  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('linter-markdown');
    await atom.packages.activatePackage('language-gfm');
  });

  describe('checks a file with issues and', () => {
    let editor = null;
    beforeEach(async () => {
      editor = await atom.workspace.open(invalidPath);
    });

    it('finds at least one message', async () => {
      const messages = await lint.provideLinter().lint(editor);
      expect(messages.length).toBeGreaterThan(0);
    });

    it('verifies the first message', async () => {
      const messages = await lint.provideLinter().lint(editor);
      expect(messages[0].severity).toBe('warning');
      expect(messages[0].location.file).toBe(invalidPath);
      expect(messages[0].location.position).toEqual([[2, 0], [2, 58]]);
      expect(messages[0].description).not.toBeDefined();
      expect(messages[0].excerpt).toBe('Found unused definition (remark-lint:no-unused-definitions)');
    });
  });

  it('finds nothing wrong with a valid file', async () => {
    const editor = await atom.workspace.open(validPath);
    const messages = await lint.provideLinter().lint(editor);
    expect(messages.length).toBe(0);
  });
});
