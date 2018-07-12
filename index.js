let fs = require('fs');
let path = require('path');
let moment = require('moment');
let logger = require('winston');
let rotateFile = require('winston-daily-rotate-file');

let defaultEnv = 'production';

function getLogger(options) {
    let logOptions = {
        timestamp: time,
        localTime: true,
        datePattern: options.datePattern || 'YYYY-MM-DD',
        handleExceptions: ((process.env.NODE_ENV || defaultEnv) === defaultEnv)
    }
    let filename = './' + (options.prgName || getPrgName()) + '.log';
    let dir = path.resolve('./', (options.logDir || '../log/'));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    logOptions.filename = path.resolve(dir, filename)
    logger.add(rotateFile, logOptions);
    logger.level = options.logLevel || 'info';
    logger.cli();
    return logger;
}

function time(datePattern) {
    datePattern = datePattern || 'YYYY-MM-DD HH:mm:ss';
    return moment().format(datePattern);
}

function getPrgName(filename) {
    let os = process.platform;
    filename = filename || process.mainModule.filename;
    let separator = os.match('darwin') ? '/' : (os.match('win') ? '\\' : '/');
    let end = (filename.lastIndexOf('.') === -1) ? filename.length : filename.lastIndexOf('.');
    filename = filename.substring(filename.lastIndexOf(separator) + 1, end);
    return filename;
}

function isBasic(param, strict) {
    if ((typeof param).match(/string|number|boolean/)) {
        return true;
    }
    if (!strict && (param === null || param === undefined)) {
        return true;
    }
    return false;
}

function loopVar(param, action) {
    if (param instanceof Array) {
        for (let ele of param) {
            loopVar(ele);
        }
        return;
    }
    if (isBasic(param, false) || (typeof param === 'function')) {
        return action(param);
    }
    for (let key in param) {
        if (param.hasOwnProperty(key)) {
            loopVar(param[key]);
        }
    }
}

function assign(obj, attris, data) {
    if (attris.length === 1) {
        obj[attris.shift()] = data;
        return;
    }
    let attri = attris.shift();
    if (!(obj.hasOwnProperty(attri))) {
        obj[attri] = {};
    }
    assign(obj[attri], attris, data);
}

function equal() {
    let rst = true;
    let params = Array.from(arguments);
    let param0 = params[0];
    for (let i = 1; i < params.length; i++) {
        if (params[i] !== param0) {
            rst = false;
            break;
        }
    }
    return rst;
}

function permute(arr, callback) {
    let finish = false;
    let arrIdx = arr.map(() => 0);
    let arrLen = arr.map(i => i.length - 1);
    while (!finish) {
        callback(arrIdx);
        finish = nextIdxs(arrIdx.length - 1);
    }
    function nextIdxs(iidx) {
        let cur = arrIdx[iidx];
        if (cur >= arrLen[iidx]) {
            if (iidx === 0) {
                return true;
            }
            arrIdx[iidx] = 0;
            return nextIdxs(iidx - 1);
        }
        arrIdx[iidx] = cur + 1;
        return false;
    }
}

function unicode(str) {
    return str.split('').map(function (value) {
        let temp = value.charCodeAt(0).toString(16).toUpperCase();
        if (temp.length > 2) {
            return '\\u' + temp;
        }
        return value;
    }).join('');
}

function isObject(param) {
    if (typeof param !== 'object' || param === null)
        return false;
    return true
}



function enable(obj, propertyName, level, initValue) {
    level = (level === 2) ? 2 : 1;
    let key = '_' + propertyName;
    if (level === 1) {
        obj[key] = initValue;
        obj[propertyName] = function (value) {
            if (arguments.length === 0)
                return obj[key];
            if (arguments.length === 1)
                obj[key] = value;
        }
        return;
    }
    if (!isObject(obj[key])) {
        if (isObject(initValue)) {
            obj[key] = initValue;
        } else {
            obj[key] = {};
        }
    }
    obj[propertyName] = function (name, value) {
        if (arguments.length === 0)
            return obj[key];
        if (arguments.length === 1)
            return obj[key][name];
        obj[key][name] = value;
    }
}

function fillJson(master, slave) {
    if (typeof slave !== 'object'
        || typeof master !== 'object'
        || master === null
        || slave === null) {
        throw new Error('master and slave must be valid object');
    }
    return _mergeJsonByMaster(master, slave);
}

function _mergeJsonByMaster(master, slave) {
    if (typeof slave !== 'object'
        || typeof master !== 'object'
        || master === null
        || slave === null) {
        return master;
    }
    for (let skey in slave) {
        if (slave.hasOwnProperty(skey)) {
            if (!master.hasOwnProperty(skey)) {
                master[skey] = (typeof slave[skey] === 'object') ? JSON.parse(JSON.stringify(slave[skey])) : slave[skey];
                continue;
            }
            master[skey] = _mergeJsonByMaster(master[skey], slave[skey]);
        }
    }
    return master;
}

function divideJson(master, slave) {
    let options = {};
    for (let skey in slave) {
        if (slave.hasOwnProperty(skey) && master.hasOwnProperty(key)) {
            options[skey] = master[skey];
            delete master[skey];
        }
    }
    return options;
}

function overrideJson(master, slave) {
    if (typeof slave !== 'object'
        || typeof master !== 'object'
        || master === null
        || slave === null) {
        throw new Error('master and slave must be valid object');
    }
    for (let mkey in master) {
        if (master.hasOwnProperty(mkey) && slave.hasOwnProperty(mkey)) {
            master[mkey] = _mergeJsonBySlave(master[mkey], slave[mkey]);
        }
    }
    return master;
}

function _mergeJsonBySlave(master, slave) {
    if (typeof slave !== 'object'
        || typeof master !== 'object'
        || master === null
        || slave === null) {
        return slave;
    }
    for (let skey in slave) {
        if (slave.hasOwnProperty(skey)) {
            master[skey] = _mergeJsonBySlave(master[skey], slave[skey]);
        }
    }
    return master;
}

module.exports = {
    assign,
    divideJson,
    enable,
    equal,
    fillJson,
    getLogger,
    getPrgName,
    isBasic,
    loopVar,
    overrideJson,
    permute,
    time,
    unicode
};