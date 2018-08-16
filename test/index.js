'use strict';

const fs = require('fs');
const path = require('path');
const t = require('tap');
let yoBow = require('..');

function resetYoBowRequire() {
  const yoBowPath = path.resolve(
    path.dirname(require.resolve('..')),
    'index.js'
  );
  delete require.cache[yoBowPath];
  yoBow = require(yoBowPath);
}
t.test('Get Bunyan Logger by passing name only', t => {
  try {
    Object.defineProperty(process, 'env', {
      value: {LOG_TO_JSON: 'true'}
    });
    const logger = yoBow.getLogger('test 1');
    let printCount = 0;

    if (logger._level <= yoBow.TRACE) logger.trace('success ' + printCount++);
    if (logger._level <= yoBow.DEBUG) logger.debug('success ' + printCount++);
    if (logger._level >= yoBow.INFO) logger.info('success ' + printCount++);
    if (logger._level >= yoBow.INFO) logger.warn('success ' + printCount++);
    if (logger._level >= yoBow.INFO) logger.error('success ' + printCount++);
    if (printCount === 3) {
      t.pass('Print Count, ' + printCount + ' is the same');
    } else {
      t.fail(
        'Print Count, ' + printCount + ' does not match with expected ' + 3
      );
    }
  } catch (err) {
    console.error('test 1: %s', err);
    console.error('test 1: %s', err.stack);
  }

  t.end();
});

t.test('Get Bunyan Logger by passing a simple option object', t => {
  const expected = {
    printCount: 5
  };

  const thisLogOptions = {
    name: 'test 2',
    src: true,
    logLevel: 'debug',
    logToJson: true
  };

  try {
    const logger = yoBow.getLogger(thisLogOptions);
    let printCount = 0;
    logger.trace('success ' + printCount++);
    logger.debug('success ' + printCount++);
    logger.info('success ' + printCount++);
    logger.warn('success ' + printCount++);
    logger.error('success ' + printCount++);

    if (printCount === expected.printCount) {
      t.pass('Print Count, ' + printCount + ' is the same');
    } else {
      t.fail(
        'Print Count, ' +
          printCount +
          ' does not match with expected ' +
          expected.printCount
      );
    }
  } catch (err) {
    console.error(thisLogOptions.name + ': %s', err);
    console.error(thisLogOptions.name + ': %s', err.stack);
  }
  t.end();
});

t.test('Get Bunyan Logger by passing a full option object', t => {
  const thisLogOptions = {
    name: 'test 3',
    src: false,
    logLevel: 'trace',
    env: 'local',
    logToJson: false,
    streams: [
      {
        level: 'trace',
        stream: process.stdout
      }
    ]
  };

  try {
    const logger = yoBow.getLogger(thisLogOptions);
    let printCount = 0;
    logger.trace('success ' + printCount++);
    logger.debug('success ' + printCount++);
    logger.info('success ' + printCount++);
    logger.warn('success ' + printCount++);
    logger.error('success ' + printCount++);
    if (printCount === 5) {
      t.pass('Print Count, ' + printCount + ' is the same');
    } else {
      t.fail(
        'Print Count, ' + printCount + ' does not match with expected ' + 5
      );
    }
  } catch (err) {
    console.error(thisLogOptions.name + ': %s', err);
    console.error(thisLogOptions.name + ': %s', err.stack);
  }

  const logOptions4 = {
    name: 'test 4',
    src: true,
    logLevel: 'shouldDefaultToInfo',
    env: 'local',
    logToJson: false
  };

  try {
    const wrongLevelLogger = yoBow.getLogger(logOptions4);
    const expectedCount = 2;
    let printCount = 0;
    if (wrongLevelLogger._level === yoBow.INFO)
      wrongLevelLogger.debug('success ' + ++printCount);
    if (wrongLevelLogger._level === yoBow.INFO)
      wrongLevelLogger.info('success ' + ++printCount);
    if (printCount === expectedCount) {
      t.pass('Print Count, ' + printCount + ' is the same');
    } else {
      t.fail(
        'Print Count, ' +
          printCount +
          ' does not match with expected ' +
          expectedCount
      );
    }
  } catch (err) {
    console.error(logOptions4.name + ': %s', err);
    console.error(logOptions4.name + ': %s', err.stack);
  }

  const logOptions5 = {
    name: 'test 5',
    src: true,
    env: 'local',
    logToJson: false
  };

  try {
    const defaultLevelLogger = yoBow.getLogger(logOptions5);
    let printCount = 0;
    if (defaultLevelLogger._level === yoBow.DEBUG)
      defaultLevelLogger.debug('success ' + ++printCount);
    if (defaultLevelLogger._level === yoBow.INFO)
      defaultLevelLogger.info('success ' + ++printCount);
    if (defaultLevelLogger._level === yoBow.INFO)
      defaultLevelLogger.warn('success ' + ++printCount);
    if (defaultLevelLogger._level === yoBow.INFO)
      defaultLevelLogger.error('success ' + ++printCount);
    if (printCount === 3) {
      t.pass('Print Count, ' + printCount + ' is the same');
    } else {
      t.fail(
        'Print Count, ' + printCount + ' does not match with expected ' + 3
      );
    }
  } catch (err) {
    console.error(logOptions5.name + ': %s', err);
    console.error(logOptions5.name + ': %s', err.stack);
  }

  const logOptions6 = {
    name: 'test 6',
    src: true,
    env: 'test',
    logToJson: false
  };

  try {
    this.originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', {
      value: 'Windows'
    });

    Object.defineProperty(process, 'env', {
      value: {LOG_TO_JSON: 'false'}
    });
    logOptions6.logLevel = 'error';
    resetYoBowRequire();
    let logger6 = yoBow.getLogger(logOptions6);
    let printCount = 0;
    if (logger6._level <= yoBow.DEBUG) logger6.debug('success ' + ++printCount);
    if (logger6._level <= yoBow.INFO) logger6.info('success ' + ++printCount);
    if (logger6._level <= yoBow.WARN) logger6.warn('success ' + ++printCount);
    if (logger6._level <= yoBow.ERROR) logger6.error('success ' + ++printCount);

    if (printCount === 1) {
      t.pass('Print Count, ' + printCount + ' is the same');
    } else {
      t.fail(
        'Print Count, ' + printCount + ' does not match with expected ' + 1
      );
    }

    Object.defineProperty(process, 'platform', {
      value: 'Darwin'
    });
    logOptions6.logLevel = 'debug';
    resetYoBowRequire();
    logger6 = yoBow.getLogger(logOptions6);
    printCount = 0;
    if (logger6._level <= yoBow.DEBUG) logger6.debug('success ' + ++printCount);
    if (logger6._level <= yoBow.INFO) logger6.info('success ' + ++printCount);
    if (logger6._level <= yoBow.WARN) logger6.warn('success ' + ++printCount);
    if (logger6._level <= yoBow.ERROR) logger6.error('success ' + ++printCount);

    if (printCount === 4) {
      t.pass('Print Count, ' + printCount + ' is the same');
    } else {
      t.fail(
        'Print Count, ' + printCount + ' does not match with expected ' + 1
      );
    }

    Object.defineProperty(process, 'platform', {
      value: this.originalPlatform
    });
  } catch (err) {
    console.error(logOptions6.name + ': %s', err);
    console.error(logOptions6.name + ': %s', err.stack);
  }
  t.end();
});
t.test('Get Bunyan Logger by passing an option object', t => {
  const expected = {
    printCount: 5
  };

  const thisLogOptions = {
    name: 'test 7',
    src: true,
    logLevel: 'debug',
    logToJson: false
  };
  const binBunyanFilePath = path.resolve(
    path.dirname(require.resolve('bunyan')),
    '..',
    '..',
    '.bin',
    'bunyan'
  );
  const renameBinBunyanFilePath = path.resolve(
    path.dirname(require.resolve('bunyan')),
    '..',
    '..',
    '.bin',
    'bunyan.bak'
  );

  try {
    console.info(
      'renaming %s to %s',
      binBunyanFilePath,
      renameBinBunyanFilePath
    );
    fs.renameSync(binBunyanFilePath, renameBinBunyanFilePath);
  } catch (err) {
    console.error(
      'error: %s. renaming %s to %s',
      err.stack,
      renameBinBunyanFilePath,
      binBunyanFilePath
    );
    fs.renameSync(renameBinBunyanFilePath, binBunyanFilePath);
  }

  try {
    // const yoBowPath = path.resolve(
    //   path.dirname(require.resolve('..')),
    //   'index.js'
    // );
    // delete require.cache[yoBowPath];
    // yoBow = require(yoBowPath);
    resetYoBowRequire();

    // thisLogOptions.logToJson = true;
    const logger = yoBow.getLogger(thisLogOptions);
    let printCount = 0;
    logger.trace('success ' + printCount++);
    logger.debug('success ' + printCount++);
    logger.info('success ' + printCount++);
    logger.warn('success ' + printCount++);
    logger.error('success ' + printCount++);

    if (printCount === expected.printCount) {
      t.pass('Print Count, ' + printCount + ' is the same');
    } else {
      t.fail(
        'Print Count, ' +
          printCount +
          ' does not match with expected ' +
          expected.printCount
      );
    }
  } catch (err) {
    console.error(thisLogOptions.name + ': %s', err);
    console.error(thisLogOptions.name + ': %s', err.stack);
  } finally {
    fs.renameSync(renameBinBunyanFilePath, binBunyanFilePath);
  }
  t.end();
});

process.exit(0);
