/**
 * Service to run http request and handle the response in a specific manner
 * @module hookService
 */
var request = require('superagent');

function index(obj, i) {return obj[i];}

module.exports = {
  // jscs:disable
  /** @function
  * @name run
  * @public
  * @param {object} hook - hook object information
  * @param {object} hook.request - http request type
  * @param {object} hook.method - the endopoint to look for
  * @param {object} hook.responsePath - the dot notation respoonse path to value to compare
  * @param {object} hook.regexValue - regex to match against value
  * @description takes a hook object and does an http request and looks for a matching value, runs call back based regex match
  * @return {null} 
  *
  */
  // jscs:enable
  run: function(hook, fn) {
    return request(hook.method, hook.request).set('Accept', 'application/json');
  }
};
