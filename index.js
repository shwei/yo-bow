'use strict';

const {statSync: stat} = require('fs');
const path = require('path');
const {spawn} = require('child_process');
const {PassThrough} = require('stream');
const bunyan = require('bunyan');

const BUNYAN_LOG_OPTIONS = ['name', 'src', 'streams', 'serializers'];
// ["trace", "debug", "info", "warn", "error", "fatal"]
const LOGGER_LEVELS = Object.keys(bunyan.levelFromName);

const DEFAULT_OPTIONS = getEnvVariables();
const WIN_PLATFORM = /^win/i.test(process.platform);

let BUNYAN_BIN_PATH = getBunyanBinPath();

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
  LOGGER_LEVELS,
  getBunyanBinPath
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
    baseStream.stream =
      options.env === 'local'
        ? prettyStream(['--color'], options.binPath)
        : prettyStream(['--no-color'], options.binPath);
  }

  const {streams} = options;
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
function prettyStream(args, binPath) {
  const stream = new PassThrough();
  let bin = binPath || BUNYAN_BIN_PATH;

  if (!bin) {
    return stream;
  }

  if (WIN_PLATFORM) {
    args = ['/c', bin].concat(args);
    bin = 'cmd';
  }

  const formatter = spawn(bin, args, {
    stdio: [null, process.stdout, process.stderr]
  });
  stream.pipe(formatter.stdin);

  return stream;
}

function resolveOptions(options) {
  if (isTypeOf(options, 'String')) {
    options = {name: options};
  }
  const newOptions = Object.assign({streams: []}, DEFAULT_OPTIONS, options, {
    logLevel: getLoggerLevelName(options.logLevel)
  });

  return newOptions;
}

function getEnvVariables() {
  return {
    name: process.platform.toLowerCase() + '_' + process.pid,
    env: process.env.NODE_ENV || 'production',
    src: process.env.LOG_SRC == 'true',
    logLevel: getLoggerLevelName(process.env.LOG_LEVEL),
    logToJson: process.env.LOG_TO_JSON == 'true' || true
  };
}

/***
 * Returns a log level. Default: info level
 * @param {String} logName  Log level name
 * @return {String}         A level: one of LOGGER_LEVELS
 */
function getLoggerLevelName(logName) {
  let fndIdx;
  if (!logName || (fndIdx = LOGGER_LEVELS.indexOf(logName.toLowerCase())) < 0) {
    return 'info';
  }

  return LOGGER_LEVELS[fndIdx];
}

/**
 *
 * @param {String} variable  this variable
 * @param {String} type      object type
 * @return {Boolean}         True, if the type of variable matches with type
 */
function isTypeOf(variable, type) {
  return (
    Object.prototype.toString
      .call(variable)
      .toLowerCase()
      .indexOf(type.toLowerCase()) > 7
  );
}

function getBunyanBinPath(lastPath) {
  if (!lastPath) {
    lastPath = path.resolve(path.dirname(require.resolve('bunyan')), '..');
  } else if (lastPath === __dirname) {
    console.info(
      'yo-bow: navigating to lastPath: %s which matches with __dirname',
      lastPath
    );
    return '';
  }

  const guessPath = path.resolve(lastPath, '..');

  try {
    stat(path.resolve(guessPath, '.bin', 'bunyan'));
    return path.resolve(guessPath, '.bin', 'bunyan');
  } catch (err) {
    return getBunyanBinPath(guessPath);
  }
}
