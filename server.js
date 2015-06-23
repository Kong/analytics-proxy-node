'use strict'

var analytics = require('mashape-analytics')
var chalk = require('chalk')
var debug = require('debug-log')('analytics-proxy')
var dotenv = require('dotenv')
var http = require('http')
var url = require('url')

dotenv.config({ silent: true })
dotenv.config({ silent: true, path: '.env.' + process.env.NODE_ENV })

if (!process.env.TOKEN) {
  console.error(chalk.red('a service token is required, visit: https://analytics.mashape.com/ to obtain one'))

  process.exit(1)
}

if (!process.env.PORT) {
  console.error(chalk.red('please provide a port number to run the proxy service on'))

  process.exit(1)
}

var agent = analytics(process.env.TOKEN, process.env.ENVIRONMENT, {
  limits: {
    bodySize: 1e10
  },
  queue: {
    batch: process.env.BATCH || 1,
    entries: process.env.ENTRIES || 1
  }
})

var server = http.createServer(function (_request, _response) {
  var uri = url.parse(_request.url)

  if (uri.hostname && uri.host) {
    uri.hostname = null
  }

  // correct url
  _request.url = uri.path

  debug('[%s]: %s', chalk.green('proxy'), chalk.grey(uri.path))

  var options = {
    port: uri.port || 80,
    host: _request.headers.host || uri.host || uri.hostname,
    path: _request.url,
    method: _request.method,
    headers: _request.headers
  }

  var request = http.request(options, function (response) {
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

server.listen(process.env.PORT, function () {
  debug('started proxy on port %s', process.env.PORT)
})
