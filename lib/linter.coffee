path = require('path')

# Lazy loading these
remark = null
lint = null

getRange = (range) ->
  m = range.match /(\d+):(\d+)(-(\d+):(\d+))?/
  r = [[],[]]
  r[0][0] = (m[1] * 1) - 1
  r[0][1] = (m[2] * 1) - 1
  r[1][0] = (m[1] * 1) - 1
  r[1][1] = m[2] * 1
  r

Configuration = require '../node_modules/remark/lib/cli/configuration.js'

errorLoadingConfig = (error, filePath) ->
  return new Promise (resolve, reject) ->
    resolve [{
      type: 'Error'
      text: error.message
      filePath: filePath
      range: [[0,0],[0,0]]
    }]

module.exports = new class # This only needs to be a class to bind lint()
  grammarScopes: ['source.gfm', 'source.pfm', 'text.md']
  name: "remark-lint"
  scope: "file"
  lintOnFly: true

  # coffeelint: disable=no_unnecessary_fat_arrows
  lint: (TextEditor) =>
  # coffeelint: enable=no_unnecessary_fat_arrows
    TextBuffer = TextEditor.getBuffer()
    filePath = TextEditor.getPath()
    if filePath

      # Transform function needs to be created here
      # as we need the filePath in the errorMessage
      transform = (message) ->
        return {
          type: 'Error'
          text: message.reason
          filePath: filePath
          range: getRange message.name
        }

      # Lazy loading required plugins
      remark ?= require 'remark'
      lint ?= require 'remark-lint'

      source = TextEditor.getText()

      new Promise (resolve, reject) ->
        # Load .remarkrc config for current file
        # TODO: Instead of constructing a configuration every time,
        # we should maybe watch .remarkrc files. But file watching
        # with atom can be a PIA, so we do not that right now
        fin = new Configuration {detectRC: true}
        conf = fin.getConfiguration filePath, (err, conf) ->
          if err
            errorLoadingConfig(e, filePath).then(resolve, reject)
            return

          # Load processor for current path
          processor = remark().use(lint, conf.plugins.lint)
          processor.process source, conf.settings, (err, res, file) ->
            reject(err) if err
            resolve(res.messages.map(transform))
