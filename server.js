'use strict'

var dotenv = require('dotenv')

dotenv.config({ silent: true })
dotenv.config({ silent: true, path: '.env.' + process.env.NODE_ENV })

var proxy = require('./lib')

proxy({
  token: process.env.MASHAPE_ANALYTICS_TOKEN,
  environment: process.env.MASHAPE_ANALYTICS_ENVIRONMENT,
  port: process.env.MASHAPE_ANALYTICS_PROXY_PORT,
  batch: process.env.MASHAPE_ANALYTICS_PROXY_BATCH,
  entries: process.env.MASHAPE_ANALYTICS_PROXY_ENTRIES,
  sockets: process.env.MASHAPE_ANALYTICS_PROXY_SOCKETS
})
