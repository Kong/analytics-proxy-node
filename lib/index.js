'use strict'

var analytics = require('mashape-analytics')
var chalk = require('chalk')
var debug = require('debug-log')('analytics-proxy')
var http = require('http')
var https = require('https')
var url = require('url')
var extend = require('xtend')

module.exports = function (options) {
  var opts = extend({
    batch: 1,
    entries: 100,
    sockets: 300,
    quiet: false
  }, options)

  if (!opts.token) {
    console.error(chalk.red('a service token is required, visit: https://analytics.mashape.com/ to obtain one'))

    process.exit(1)
  }

  if (!opts.port) {
    console.error(chalk.red('please provide a port number to run the proxy service on'))

    process.exit(1)
  }

  // increase total number of sockets
  http.globalAgent.maxSockets = opts.sockets
  https.globalAgent.maxSockets = opts.sockets

  var logger = opts.quiet ? debug : console.info

  var agent = analytics(opts.token, opts.environment, {
    limits: {
      bodySize: 1e10
    },
    queue: {
      batch: opts.batch,
      entries: opts.entries
    }
  })

  var server = http.createServer(function (_request, _response) {
    var uri = url.parse(_request.url)

    if (uri.hostname && uri.host) {
      uri.hostname = null
    }

    // correct url
    _request.url = uri.path

    var reqOpts = {
      port: uri.port || 80,
      host: _request.headers.host || uri.host || uri.hostname,
      path: _request.url,
      method: _request.method,
      headers: _request.headers
    }

    logger('[%s]: %s', chalk.green('proxy'), chalk.grey(uri.protocol + '//' + reqOpts.host + reqOpts.path.substring(0, 100)))

    var protocol = (uri.protocol === 'https:' ? https : http)

    var request = protocol.request(reqOpts, function (response) {
      var chunks = []

      // inject Mashape Analytics agent
      agent(_request, _response)

      _response.writeHead(response.statusCode, response.statusMessage, response.headers)

      response.on('data', function (chunk) {
        chunks.push(chunk)
      })

      response.on('end', function () {
        _response.end(Buffer.concat(chunks))
      })

    })

    request.on('error', function (e) {
      console.log(chalk.red('problem with request: ' + e.message))
    })

    _request.pipe(request, {
      end: true
    })
  })

  server.listen(opts.port, function () {
    console.info('started proxy on port [%s]', chalk.yellow(opts.port))
  })
}
