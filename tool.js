function getPrgName() {
    let os = process.platform;
    let filename = process.mainModule.filename;
    let separator = os.match('darwin') ? '/' : (os.match('win') ? '\\' : '/');
    filename = filename.substring(filename.lastIndexOf(separator) + 1, filename.lastIndexOf('.'));
    return filename;
}

function judgeType(param) {
    let type = typeof param;
    if (param === null || type.match(/string|number|boolean|undefined/)) {
        return 'basic';
    }
    if (param instanceof Array) {
        return 'array';
    }
    return 'object';
}

function loopVar(param, action) {
    let type = judgeType(param);
    if ('basic' === type) {
        return action(param);
    }
    if ('array' === type) {
        for (let ele of param) {
            loopVar(ele);
        }
        return;
    }
    for (let key in param) {
        loopVar(param[key]);
    }
}

function assign(obj, attris, data) {
    if (!(attris instanceof Array) || attris.length < 1) return;
    if (typeof obj != 'object') return;
    if (attris.length == 1) {
        obj[attris.shift()] = data;
        return;
    }
    let attri = attris.shift();
    if (typeof obj[attri] != 'object' || obj[attri] == null) {
        obj[attri] = {};
    }
    assign(obj[attri], attris, data);
}

function multiEqual(params) {
    let rst = true;
    let param0 = params[0];
    for (let i = 1; i < params.length; i++) {
        if (params[i] != param0) {
            rst = false;
            break;
        }
    }
    return rst;
}

function traverse(arr, callback) {

    arrIdx = arr.map(() => 0);
    arrLen = arr.map(i => i.length - 1);
    while (!finish()) {
        callback(arrIdx);
        nextIdxs(arrIdx.length - 1);
    }
    function nextIdxs(iidx) {
        let cur = arrIdx[iidx];
        if (cur >= arrLen[iidx]) {
            arrIdx[iidx] = 0;
            nextIdxs(iidx - 1);
        } else {
            arrIdx[iidx] = cur + 1;
        }
    }
    function finish() {
        let rst = true;
        for (let i = 0; i < arrIdx.length; i++) {
            if (arrIdx[i] != arrLen[i]) {
                rst = false;
                break;
            }
        }
        return rst;
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

module.exports = { getPrgName };