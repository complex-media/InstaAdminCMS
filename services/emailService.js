var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var config = require('../config/index.js');

var options = {
  accessKeyId: config.awsSes.accessKeyId,
  secretAccessKey: config.awsSes.secretAccessKey,
  region: config.awsSes.region,
  rateLimit: 5 // do not send more than 5 messages in a second
};
var transporter = nodemailer.createTransport(sesTransport(options));

module.exports = {
  send: function(mailOptions, fn) {
    // fn(null,null);
    // send mail with defined transport object
    return transporter.sendMail(mailOptions);
  }
};
