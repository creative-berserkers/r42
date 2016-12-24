const winston = require('winston')
const path = require('path')

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: path.join(__dirname, 'data/server.log')})
  ]
})

export default {
  debug(...args){
    logger.debug(...args)
  },
  info(...args){
    logger.info(...args)
  },
  warn(...args){
    logger.warn(...args)
  },
  error(...args){
    logger.error(...args)
  }
}