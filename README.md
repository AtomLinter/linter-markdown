# linter-markdown

[![Build Status](https://travis-ci.org/AtomLinter/linter-markdown.svg?branch=master)](https://travis-ci.org/AtomLinter/linter-markdown)
[![Circle CI](https://circleci.com/gh/AtomLinter/linter-markdown/tree/master.svg?style=shield)](https://circleci.com/gh/AtomLinter/linter-markdown/tree/master)
[![Build status](https://ci.appveyor.com/api/projects/status/owck145l404p4f7k/branch/master?svg=true)](https://ci.appveyor.com/project/SpainTrain/linter-markdown/branch/master)

[![bitHound Overalll Score](https://www.bithound.io/github/AtomLinter/linter-markdown/badges/score.svg)](https://www.bithound.io/github/AtomLinter/linter-markdown)
[![bitHound Dependencies](https://www.bithound.io/github/AtomLinter/linter-markdown/badges/dependencies.svg)](https://www.bithound.io/github/AtomLinter/linter-markdown/master/dependencies/npm)
[![Plugin installs!](https://img.shields.io/apm/dm/linter-markdown.svg)](https://atom.io/packages/linter-markdown)
[![Package version!](https://img.shields.io/apm/v/linter-markdown.svg?style=flat)](https://atom.io/packages/linter-markdown)

Lint markdown files using [remark-lint][remark-lint] and the
[linter][linter] package for atom.

If there is no configuration found for **remark-lint**, this linter runs [remark-preset-lint-consistent][consistent] and
[remark-preset-lint-recommended][recommended] (both can be turned off).

If there *is* configuration for **remark-lint**, through `.remarkrc` files
or `remarkConfig` in `package.json`s, this linter works just like
[remark-cli][cli] but only uses the **remark-lint** plugin. Make sure
**remark-lint** is installed in this case (optionally globally).

Read more about configuring [remark-lint][configuration] on its README.

A similar linter, [linter-remark][], runs all remark plugins, but only
when they are configured to run.

We also maintain a [changelog][changelog] containing recent changes.

![Screenshot of linter-markdown in action][screenshot]

[remark-lint]: https://github.com/wooorm/remark-lint
[changelog]: https://github.com/AtomLinter/linter-markdown/blob/master/CHANGELOG.md
[configuration]: https://github.com/wooorm/remark-lint#configuring-remark-lint
[linter]: https://atom.io/packages/linter
[screenshot]: https://raw.githubusercontent.com/AtomLinter/linter-markdown/master/assets/screenshot.png
[cli]: https://github.com/wooorm/remark/tree/master/packages/remark-cli
[consistent]: https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-consistent
[recommended]: https://github.com/wooorm/remark-lint/tree/master/packages/remark-preset-lint-recommended
[linter-remark]: https://github.com/wooorm/linter-remark
