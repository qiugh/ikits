function getPrgName(filename) {
    let os = process.platform;
    filename = filename || process.mainModule.filename;
    let separator = os.match('darwin') ? '/' : (os.match('win') ? '\\' : '/');
    filename = filename.substring(filename.lastIndexOf(separator) + 1, filename.lastIndexOf('.'));
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
    if (isBasic(param) || (typeof param === 'function')) {
        return action(param);
    }
    for (let key in param) {
        loopVar(param[key]);
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

function sortKey(obj) {
    return Object.keys(obj).sort();
}

module.exports = {
    getPrgName,
    isBasic,
    loopVar,
    assign,
    equal,
    permute,
    unicode,
    sortKey
};