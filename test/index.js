'use strict';

const test = require('tape');
const yoBow = require('../');

test('Get Bunyan Logger by passing name only', t => {
  t.plan(1);
  const expected = {
    printCount: 5,
    envVariables: {
      env: 'production',
      logLevel: 'info',
      logToJson: false,
    },
  };

  try {
    const logger = yoBow.getLogger('test 1');
    let printCount = 0;
    logger.trace('success ' + printCount++);
    logger.debug('success ' + printCount++);
    logger.info('success ' + printCount++);
    logger.warn('success ' + printCount++);
    logger.error('success ' + printCount++);
    t.same(
      printCount,
      expected.printCount,
      'Print Count, ' + printCount + ' is the same'
    );
  } catch (err) {
    throw new Error(err);
  }

  t.end();
});

test('Get Bunyan Logger by passing a simple option object', t => {
  t.plan(1);
  const expected = {
    printCount: 5,
    envVariables: {
      env: 'production',
      logLevel: 'info',
      logToJson: false,
    },
  };

  const thisLogOptions = {
    name: 'test 2',
    src: true,
    logLevel: 'debug',
  };

  try {
    const logger = yoBow.getLogger(thisLogOptions);
    let printCount = 0;
    logger.trace('success ' + printCount++);
    logger.debug('success ' + printCount++);
    logger.info('success ' + printCount++);
    logger.warn('success ' + printCount++);
    logger.error('success ' + printCount++);
    t.same(
      printCount,
      expected.printCount,
      'Print Count, ' + printCount + ' is the same'
    );
  } catch (err) {
    throw new Error(err);
  }

  t.end();
});

test('Get Bunyan Logger by passing a full option object', t => {
  t.plan(1);
  const expected = {
    printCount: 5,
    envVariables: {
      env: 'production',
      logLevel: 'info',
      logToJson: false,
    },
  };

  const thisLogOptions = {
    name: 'test 3',
    src: true,
    logLevel: 'trace',
    env: 'local',
  };

  try {
    const logger = yoBow.getLogger(thisLogOptions);
    let printCount = 0;
    logger.trace('success ' + printCount++);
    logger.debug('success ' + printCount++);
    logger.info('success ' + printCount++);
    logger.warn('success ' + printCount++);
    logger.error('success ' + printCount++);
    t.same(
      printCount,
      expected.printCount,
      'Print Count, ' + printCount + ' is the same'
    );
  } catch (err) {
    throw new Error(err);
  }

  t.end();
});
