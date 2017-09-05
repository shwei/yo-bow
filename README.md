## yo-bow (Yet One more Bunyan Output Wrapper)
A Bunyan logger instance that outputs in a non-JSON format

## Motivation
Bunyan outputs in JSON format. It is great for processing the logs programmatically, but I had a hard time to read the 
logs in that format. So I wrote this wrapper function that returns a Bunyan logger instance and outputs in a more 
readable format to human. 

## Build status
[![Build Status](https://travis-ci.org/shwei/yo-bow.svg?branch=master)](https://travis-ci.org/shwei/yo-bow)
[![Build status](https://ci.appveyor.com/api/projects/status/p6edh0vg001r4e7h?svg=true)](https://ci.appveyor.com/project/shwei/yo-bow)
[![Coverage Status](https://coveralls.io/repos/github/shwei/yo-bow/badge.svg?branch=master)](https://coveralls.io/github/shwei/yo-bow?branch=master)

## Code style
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
prettier --write --single-quote --trailing-comma=es5
 

## Tech/framework used
[Bunyan](https://github.com/trentm/node-bunyan)


## Features
- Easy to have Bunyan output to a JSON format or to regular text. 
- Also run in Microsoft Windows.


## Code Example
### Use the library
```javascript
    const yoBow = require('yo-bow');
    const logger = yoBow.getLogger('test 1');
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