let moment = require('moment');

function time(datePattern) {
    datePattern = datePattern || 'YYYY-MM-DD HH:mm:ss';
    return moment().format(datePattern);
}

module.exports = { time };