let fs = require('fs');
let path = require('path');
let logger = require('winston');
let time = require('./time.js').time;
let prgName = require('./tool.js').getPrgName;
let dailyRotate = require('winston-daily-rotate-file');

let defaultEnv = 'production';

function getLogger(options, logType) {
    logType = logType || 1;
    let logOptions = {
        localTime: true,
        datePattern: options.datePattern,
        handleExceptions: ((process.env.NODE_ENV || defaultEnv) === defaultEnv),
        timestamp: time
    }
    let type = dailyRotate;
    let prgName = options.prgName || prgName();
    let fileName = './' + prgName + '.log';
    if (logType === 1) {
        filename += time(options.datePattern);
        type = logger.transports.File;
        delete logOptions.localTime;
        delete logOptions.datePattern;
    }
    let dir = path.resolve(__dirname, (options.logDir || '../log/'));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    logOptions.filename = path.resolve(dir, fileName)
    logger.add(type, logOptions);
    logger.level = options.logLevel || 'info';
    logger.cli();
    return logger;
}

module.exports = getLogger;