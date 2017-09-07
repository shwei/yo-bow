'use strict';

const fs = require('fs');
const path = require('path');
const bunyan = require('bunyan');
const through = require('through');
const spawn = require('child_process').spawn;

const LOGGER_LEVELS = ['info', 'debug', 'error', 'fatal', 'trace', 'warn'];

const ENV_VARS = getEnvVariables();

const logOptions = {
  serializers: bunyan.stdSerializers,
  src: false
};

module.exports = { getLogger, logLevels: LOGGER_LEVELS };

/**
 * Return an instance of Bunyan logger.
 *  Simple Code example:
 *    const yoBow = require('yo-bow');
 *    const logger = yoBow.getLogger('test 1');
 *    logger.trace('Yeah!!');
 *
 *  Or pass in an object:
 *    const yoBow = require('yo-bow');
 *    const thisLogOptions = {
 *      name: 'test 3',
 *      src: false,         // Include line number and source file; default: false
 *      logLevel: 'trace',  // Set to a certain log level for this logger instance if log level is not set in the
 *                          // environment variable: process.env.LOG_LEVEL
 *      env: 'local',       // If env is local, console log will be in colors based on the log levels. env looks at
 *                          // process.env.NODE_ENV; default: production
 *      logToJson: false    // Default: false. If true, output will be in JSON format. Or the environment variable,
 *                          // process.env.LOG_TO_JSON can be set.
 *    };
 *
 *
 *
 * @param logConfig
 */
function getLogger(logConfig) {
  let options = {
    serializers: logOptions.serializers,
    src: logOptions.src
  };

  let logLevel = ENV_VARS.logLevel;
  let logToJson = ENV_VARS.logToJson;
  let env = ENV_VARS.env;

  if (Object.prototype.toString.call(logConfig).indexOf('String') > -1) {
    options.name = logConfig;
  } else {
    options.name = logConfig.name;
    options.src = logConfig.src || false;
    if (logConfig.logLevel) {
      logLevel = logConfig.logLevel;
    }
    if (logConfig.logToJson !== undefined) {
      logToJson = logConfig.logToJson;
    }
    if (logConfig.env) {
      env = logConfig.env;
    }
  }

  let argColor = '--no-color';
  if (env === 'local') {
    argColor = '--color';
  }

  const args = [argColor];

  options.streams = [
    {
      level: logLevel,
      stream: prettyStream(args)
    }
  ];

  if (logToJson) {
    options.streams = [
      {
        level: logLevel,
        stream: process.stdout
      }
    ];
  }

  return bunyan.createLogger(options);
}

// based on the work from https://github.com/trentm/node-bunyan/issues/13#issuecomment-22439322
function prettyStream(args) {
  let bin = path.resolve(
    path.dirname(require.resolve('bunyan')),
    '..',
    'bin',
    'bunyan'
  );

  if (/^win/.test(process.platform)) {
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

function getEnvVariables() {
  return {
    env: process.env.NODE_ENV || 'production',
    logLevel: getLoggerLevel(process.env.LOG_LEVEL),
    logToJson: process.env.LOG_TO_JSON === 'true'
  };
}

/***
 * Returns a log level. Default: info level
 * @param logName
 * @returns a log level and if it's not one of the 6 choices, return "info"
 */
function getLoggerLevel(logName) {
  let foundLoggerIdx = LOGGER_LEVELS.indexOf(logName);
  if (foundLoggerIdx < 0) {
    foundLoggerIdx = 0;
  }

  return LOGGER_LEVELS[foundLoggerIdx];
}
