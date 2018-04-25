var env = process.env.NODE_ENV || 'local';
module.exports = require('./' + env + '.json');
