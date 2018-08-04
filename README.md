## yo-bow (Yet One more Bunyan Output Wrapper)

A Bunyan logger instance that outputs in a non-JSON format

## Motivation

Bunyan outputs in JSON format. It is great for processing the logs programmatically, but I had a hard time sift through the
logs in that format during my local development. So I wrote this wrapper function that returns a Bunyan logger instance that outputs to a more
readable format.

## Build status

[![Build Status](https://travis-ci.org/shwei/yo-bow.svg?branch=master)](https://travis-ci.org/shwei/yo-bow)
[![Build status](https://ci.appveyor.com/api/projects/status/p6edh0vg001r4e7h?svg=true)](https://ci.appveyor.com/project/shwei/yo-bow)
[![Coverage Status](https://coveralls.io/repos/github/shwei/yo-bow/badge.svg?branch=master)](https://coveralls.io/github/shwei/yo-bow?branch=master)

## Code style

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

```
---
bracketSpacing: false
printWidth: 80
semi: true
singleQuote: true
tabWidth: 2
useTabs: false
```

## Tech/framework used

[Bunyan](https://github.com/trentm/node-bunyan)

## Features

- Easy to have Bunyan output to a JSON format or to regular text.
- Also works in Microsoft Windows.

## Code Example

### Use the library - Just pass in the name of the logger

```javascript
const logger = require('yo-bow').getLogger('test 1');
let printCount = 0;
logger.trace('success ' + printCount++);
logger.debug('success ' + printCount++);
logger.info('success ' + printCount++);
logger.warn('success ' + printCount++);
logger.error('success ' + printCount++);
// Log Level is set to 'info' as default, so any levels below 'info' will not be displayed
```

### Actual Output

```
[2017-09-04T17:40:30.168Z]  INFO: test 1/6555 on DESKTOP-D2APBPO: success 2
[2017-09-04T17:40:30.170Z]  WARN: test 1/6555 on DESKTOP-D2APBPO: success 3
[2017-09-04T17:40:30.170Z] ERROR: test 1/6555 on DESKTOP-D2APBPO: success 4
```

### Use the library - Pass in logging options

```javascript
const thisLogOptions = {
  name: 'test 3',
  src: false,
  logLevel: 'trace',
  env: 'local',
  logToJson: false,
  streams: [
    // additional output stream that has a logging level of warning or
    // greater to stdout
    {
      level: 'warn',
      stream: process.stdout
    }
  ]
};

const logger = yoBow.getLogger(thisLogOptions);
let printCount = 0;
logger.trace('success ' + printCount++);
logger.debug('success ' + printCount++);
logger.info('success ' + printCount++);
logger.warn('success ' + printCount++);
logger.error('success ' + printCount++);
```

### Actual Output

{"name":"test 3","hostname":"DESKTOP-D2APBPO","pid":10115,"level":40,"msg":"success 3","time":"2018-08-03T23:46:37.146Z","v":0}<br/>
{"name":"test 3","hostname":"DESKTOP-D2APBPO","pid":10115,"level":50,"msg":"success 4","time":"2018-08-03T23:46:37.146Z","v":0}<br/>
[2018-08-03T23:46:37.144Z] TRACE: test 3/10115 on DESKTOP-D2APBPO: <span style="color:#4DBED5">success 0</span><br/>
[2018-08-03T23:46:37.146Z] <span style="color:#E5E510">DEBUG</span>: test 3/10115 on DESKTOP-D2APBPO: <span style="color:#4DBED5">success 1</span><br/>
[2018-08-03T23:46:37.146Z] <span style="color:#4DBED5">INFO</span>: test 3/10115 on DESKTOP-D2APBPO: <span style="color:#4DBED5">success 2</span><br/>
[2018-08-03T23:46:37.146Z] <span style="color:#BC3FA8">WARN</span>: test 3/10115 on DESKTOP-D2APBPO: <span style="color:#4DBED5">success 3</span><br/>
[2018-08-03T23:46:37.146Z] <span style="color:#CD312D">ERROR</span>: test 3/10115 on DESKTOP-D2APBPO: <span style="color:#4DBED5">success 4</span><br/>

## Installation

```bash
npm install yo-bow --save
```

## Tests

```bash
npm test
```

## Contribute

Just fork it, change it, and make a pull request!

## Credits

The prettyStream function is based on @jameswyse's [comment on GitHub](https://github.com/trentm/node-bunyan/issues/13#issuecomment-22439322)

## License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

MIT © [Shang Heng Wei](https://github.com/shwei)
