'use babel';

import * as path from 'path';
import * as lint from '..';

describe('The remark-lint provider for Linter', () => {
  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-markdown');
      return atom.packages.activatePackage('language-gfm').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures', 'definition-use-valid.md'))
      );
    });
  });

  describe('checks a file with issues and', () => {
    let editor = null;
    const invalidPath = path.join(__dirname, 'fixtures', 'definition-use-invalid.md');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(invalidPath).then((openEditor) => { editor = openEditor; })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint.provideLinter().lint(editor).then(messages =>
          expect(messages.length).toBeGreaterThan(0)
        )
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() =>
        lint.provideLinter().lint(editor).then((messages) => {
          expect(messages[0].type).toEqual('Warning');
          expect(messages[0].text).not.toBeDefined();
          expect(messages[0].html).toEqual(
            '<span class="badge badge-flexible">remark-lint:' +
            'no-unused-definitions</span> Found unused definition'
          );
          expect(messages[0].filePath).toMatch(/.+definition-use-invalid\.md$/);
          expect(messages[0].range).toEqual([[2, 0], [2, 58]]);
        })
      );
    });
  });

  it('finds nothing wrong with a valid file', () => {
    const validPath = path.join(__dirname, 'fixtures', 'definition-use-valid.md');
    waitsForPromise(() =>
      atom.workspace.open(validPath).then(editor =>
        lint.provideLinter().lint(editor).then(messages =>
          expect(messages.length).toBe(0)
        )
      )
    );
  });
});
