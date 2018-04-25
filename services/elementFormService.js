/**
 * service to get element specific config data
 * @module elementFormService
 * @todo merge with componenteSErvice elementForservice and temporaray-resource-moduel
 */

var mongoose = require('mongoose');
var Elements = require('../models/elements');

module.exports = {
  // jscs:disable
  /** @function
  * @name get
  * @public
  * @param {object} data - NAN
  * @param {object} fn - callback function
  * @description Gets specific template path and default data on Elements
  * @return {null} 
  *
  */
  // jscs:enable
  get: function(data, fn) {
    var promise = new Promise(function(resolve, reject) {
      var elementsData = {};
      for (var element in Elements) {
        if (Elements[element].form.enable) {
          elementsData[element] = {
            formPath: '/app/element-form/views/element-' + element + '.html',
            default: Elements[element].form.default
          };
        }
      }

      if(fn){
        fn(elementsData);
      }
      resolve(elementsData);
    });

    return promise;
  }
};
