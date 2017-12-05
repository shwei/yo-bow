'use strict';

const t = require('tap');
const yoBow = require('../');

t.test('Get Bunyan Logger by passing name only', t => {
  const expected = {
    printCount: 5
  };

  try {
    const logger = yoBow.getLogger('test 1');
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
    throw new Error(err);
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
    throw new Error(err);
  }
  t.end();
});

t.test('Get Bunyan Logger by passing a full option object', t => {
  const expected = {
    printCount: 5
  };

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
    throw new Error(err);
  }
  t.end();
});

process.exit(0);
