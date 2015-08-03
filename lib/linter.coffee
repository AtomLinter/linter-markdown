path = require('path')

# Lazy loading these
mdast = null
lint = null

getRange = (range) ->
  m = range.match /(\d+):(\d+)(-(\d+):(\d+))?/
  r = [[],[]]
  r[0][0] = (m[1] * 1) - 1
  r[0][1] = (m[2] * 1) - 1
  r[1][0] = (m[1] * 1) - 1
  r[1][1] = m[2] * 1
  r

Configuration = require '../node_modules/mdast/lib/cli/configuration.js'

fin = new Configuration {detectRC: true}


module.exports = new class # This only needs to be a class to bind lint()

  grammarScopes: ['source.gfm', 'source.pfm']
  scope: "file"
  lintOnFly: true

  # coffeelint: disable=no_unnecessary_fat_arrows
  lint: (TextEditor) =>
  # coffeelint: enable=no_unnecessary_fat_arrows
    TextBuffer = TextEditor.getBuffer()
    filePath = TextEditor.getPath()
    if filePath
      # Lazy loading required plugins
      mdast ?= require 'mdast'
      lint ?= require 'mdast-lint'

      # Load .mdastrc config for current file
      conf = fin.getConfiguration filePath

      # Load processor for current path
      processor = mdast().use(lint, conf.plugins.lint)

      source = TextEditor.getText()

      # Transform function needs to be created here
      # as we need the filePath in the errorMessage
      transform = (message) ->
        return {
          type: 'Error'
          text: message.reason
          filePath: filePath
          range: getRange message.name
        }

      new Promise (resolve, reject) ->
        processor.process source, conf.settings, (err, res, file) ->
          reject(err) if err
          resolve(res.messages.map(transform))
