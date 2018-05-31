let nodeMailer = require('nodemailer');

let transport = nodeMailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    auth: {
        user: 'finform@163.com',
        pass: 'finform163'
    }
});

function sendMail(to, text, subject) {
    transport.sendMail({
        to: to,
        text: text,
        subject: subject,
        from: "finform@163.com"
    }, function () {
        transport.close();
    });
}

module.exports = sendMail;