var mongoose = require('mongoose');
var resourceTemplate = require('../models/resources/resource-template.js');

module.exports = {
  get: function(someData, fn) {
    return resourceTemplate.find({'$and': [{state: 1},{delete: {'$ne': true}}]}, '_id title', function(err, templates) {
      if ( fn ) {
        if (!err) {
            fn(templates);
        } else {
            fn([]);
        }
      }
    });
  }
};
