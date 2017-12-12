'use strict';

const fs = require('fs');
const path = require('path');
const bunyan = require('bunyan');
const through = require('through');
const spawn = require('child_process').spawn;

const BUNYAN_LOG_OPTIONS = ['name', 'src', 'streams', 'serializers'];
const LOGGER_LEVELS = Object.keys(bunyan.levelFromName);

const ENV_VARS = getEnvVariables();

module.exports = {
  getLogger,
  logLevels: LOGGER_LEVELS,
  TRACE: bunyan.TRACE,
  DEBUG: bunyan.DEBUG,
  INFO: bunyan.INFO,
  WARN: bunyan.WARN,
  ERROR: bunyan.ERROR,
  FATAL: bunyan.FATAL,
  resolveLevel: bunyan.resolveLevel,
  levelFromName: bunyan.levelFromName,
  nameFromLevel: bunyan.nameFromLevel,
  LOGGER_LEVELS
};

/**
 * Return an instance of Bunyan logger.
 *  Simple Code example:
 *    const logger = require('yo-bow').getLogger('test 1');
 *    logger.info('Yeah!!');
 *
 *  Or pass in an object:
 *    const yoBow = require('yo-bow');
 *    const thisLogOptions = {
 *      name: 'test 2',
 *      src: true,          // default: false
 *      logLevel: 'trace',  // default: info
 *      env: 'local',       // default: production
 *      logToJson: false    // default: false
 *    };
 *
 *    const logger = yoBow.getLogger(thisLogOptions);
 *    logger.trace('Yo! Bow!!');
 *
 *
 *
 * @param {Object}  options           Configuration for logging
 * @param {String}  options.name      Name of the logger
 * @param {Boolean} options.src       If true, show line number
 * @param {String}  options.logLevel  Set to a log level for this logger
 *                                      instance Level: trace, debug, info,
 *                                      warn, error, fatal.
 *                                      Or from process.env.LOG_LEVEL
 * @param {Boolean} options.logToJson If true, log is in JSON format.
 *                                      Or from process.env.LOG_TO_JSON
 * @param {String}  options.env       If env == 'local', console log
 *                                      will be in colors based on the
 *                                      log levels.
 *                                      Or from process.env.NODE_ENV.
 *                                      Default: production
 * @param {Array}   options.streams   A list of writable streams will be
 *                                      included with a default stream
 *                                      that outputs to console.
 *
 */
function getLogger(options) {
  options = resolveOptions(options);

  let baseStream = {
    level: options.logLevel,
    stream: process.stdout
  };

  if (!options.logToJson) {
    baseStream = {
      level: options.logLevel,
      stream:
        options.env == 'local'
          ? prettyStream(['--color'])
          : prettyStream(['--no-color'])
    };
  }

  const streams = options.streams;
  streams.push(baseStream);
  options.streams = streams;
  options.serializers = bunyan.stdSerializers;
  const opts = BUNYAN_LOG_OPTIONS.reduce(
    (acc, opt) => Object.assign(acc, {[opt]: options[opt]}),
    {}
  );
  return bunyan.createLogger(opts);
}

// Based on the work from
// https://github.com/trentm/node-bunyan/issues/13#issuecomment-22439322
function prettyStream(args) {
  let bin = path.resolve(
    path.dirname(require.resolve('bunyan')),
    '..',
    'bin',
    'bunyan'
  );

  if (/^win/i.test(process.platform)) {
    args = ['/c', 'bunyan'].concat(args);
    bin = 'cmd';
  }

  const stream = through(
    function write(data) {
      this.queue(data);
    },
    function end() {
      this.queue(null);
    }
  );

  if ((bin && fs.existsSync(bin)) || bin === 'cmd') {
    const formatter = spawn(bin, args, {
      stdio: [null, process.stdout, process.stderr]
    });
    stream.pipe(formatter.stdin);
  }

  return stream;
}

function resolveOptions(options) {
  if (isTypeOf(options, 'String')) {
    options = {name: options};
  }
  options.src = options.src || false;
  options.logLevel = getLoggerLevelName(options.logLevel) || ENV_VARS.logLevel;
  options.logToJson = options.logToJson || ENV_VARS.logToJson;
  options.env = options.env || ENV_VARS.env;
  options.streams = options.streams || [];

  return options;
}
function getEnvVariables() {
  return {
    env: process.env.NODE_ENV || 'production',
    logLevel: getLoggerLevelName(process.env.LOG_LEVEL),
    logToJson: process.env.LOG_TO_JSON == 'true'
  };
}

/***
 * Returns a log level. Default: info level
 * @param {String} logName  Log level name
 * @return {String}         A level: one of LOGGER_LEVELS
 */
function getLoggerLevelName(logName) {
  if (!logName) {
    return 'info';
  }
  const foundLoggerIdx = LOGGER_LEVELS.indexOf(logName.toLowerCase());
  if (foundLoggerIdx < 0) {
    return 'info';
  }

  return LOGGER_LEVELS[foundLoggerIdx];
}

/**
 *
 * @param {String} variable  this variable
 * @param {String} type      object type
 * @return {Boolean}         True, if the type of variable matches with type
 */
function isTypeOf(variable, type) {
  const toString = Object.prototype.toString;
  const varType = toString.call(variable).toLowerCase();

  return varType.indexOf(type.toLowerCase()) > 7;
}
