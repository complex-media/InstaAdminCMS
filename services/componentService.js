/**
 * Used to return component or branch of abstract elements to be use in apps
 * @module componentService
 * @todo merge with componenteSErvice elementForservice and temporaray-resource-moduel
 */
var mongoose = require('mongoose');
var resourceComponent = require('../models/resources/resource-component.js');

function structureComponents(components) {
  var structuredComponents = {'misc': []};

  components.forEach(function(comp, index) {
    var newcomp = {children: comp.appData, name: comp.title , description: comp.description};
    newcomp.__t = 'Component';
    newcomp.fieldName = comp.title.replace(/[^\w_]+/g, '-');

    if (typeof comp.tags != 'undefined' && comp.tags.length > 0) {
      if (typeof structuredComponents[comp.tags[0]] == 'undefined') {
        structuredComponents[comp.tags[0]] = [];
      }
      structuredComponents[comp.tags[0]].push(newcomp);
    } else {
      structuredComponents.misc.push(newcomp);
    }
  });
  return structuredComponents;
}

module.exports = {
  // jscs:disable
  /** @function
  * @name get
  * @public
  * @param {array} components - array of components objects
  * @param {object} fn - callback funciton
  * @description Gets a list of differt type of components in proper element structure to be duplicated on to apps
  * @return {object} a object list of different components that are made from groups of elements
  *
  */
  // jscs:enable
  get: function(someData, fn) {
    return resourceComponent.find({'$and': [{state: 1},{delete: {'$ne': true}}]}, function(err, components) {
      if ( fn ) {
        if (!err) {
          fn(structureComponents(components));
        } else {
          fn([]);
        }
      }
    });
  }
};
