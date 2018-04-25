/**
 * Module with CRUD operations to be applied to resources which can be of type __t : [App|Component|Template]
 * @module resourceService
 */
var debug = require('debug')('instaadmin:resourceService');
var mongoose = require('mongoose');
var _ = require('lodash');
var Elements = require('../models/elements');
var resourceTemplate = require('../models/resources/resource-template.js');

var schemaAttrName = 'appData';
var moment = require('moment');
var wsService = require('../services/webSocketService');

/** Gets the Path of a subdocument based on subdId
  Should be a recursive sturcutre with children being an array
  Type componenet decides if function should be recursive to next level
* @access private
*/
var _getElementPath = function(schemaData, id) {
    var path = '';
    _.each(schemaData, function(value, key) {
      var returnPath;
      if (value.__t == 'Component') {
        returnPath = _getElementPath(value.children, id);
      }
      if (value._id == id) {
        path = key;
      } else if (typeof returnPath != 'undefined' && returnPath !== '') {
        path = key + '.children.' + returnPath;
      }

    });
    // this might run everywhere need to break out if bad
    return path;
  };

/**
  Structure data for specific use. Eg proper structure for front end visualization
* @access private
*/
var _structureData = function(data, originField, newField, config) {
  var tempNode = data;
  if (typeof tempNode[0] == 'undefined') {
    tempNode[newField] = tempNode[originField];
  } if (typeof tempNode[schemaAttrName] != 'undefined') {
    _.each(tempNode[schemaAttrName], function(value, key) {
      tempNode[schemaAttrName][key] = _structureData(value, originField, newField, config);
    });
  } if (typeof tempNode.children != 'undefined') {
    _.each(tempNode.children, function(value, key) {
      tempNode.children[key] = _structureData(value, originField, newField, config);
    });
  }

  if (typeof config.useData != 'undefined' && config.useData == true) {
    tempNode.data = _returnObjExceptFor(tempNode, ['children','appData']);
  }

  if (typeof config.useType != 'undefined' && config.useType == 'developer') {
    if (typeof tempNode.children != 'undefined' && typeof tempNode.children[0] != 'undefined' && tempNode.__t == 'Component' && tempNode.isList == true) {
      tempNode.children = [tempNode.children[0]];
    }
  }

  return tempNode;
};

/**
  Returns objects attributes omitting  based on array of keys
* @access private
*/
var _returnObjExceptFor = function(obj, Omitkeys) {
  var tempobj = {};
  _.each(obj, function(value, key) {
    if (_.indexOf(Omitkeys, key) === -1) {
      tempobj[key] = value;
    }
  });
  return tempobj;
};

var _isValidElement = function(elementStructure) {
  var valid = true;
  elementStructure.forEach(function(structure) {
    if (typeof structure.__t === undefined) {
      valid = false;
    }
    if (structure.__t.substr(0).toLowerCase() != 'component' && typeof structure.value === undefined) {
      valid = false;
    }
  });
  return valid;
};

/**
  Return obj reference based on string path of object.
* @access private
*/
var _buildpathObjFn = function(obj, dot) {
  return obj[dot];
};

/**
  Return obj reference based on string path of object.
* @access private
*/
var _buildPathObj = function(path, obj) {
  var tell = path.split('.').reduce(_buildpathObjFn, obj);
  return tell;
};

/**
  Uses sub docs and schema and rebuilds a element structure incorporating these.
* @access private
*/
var _schemafieldElements = function(elementStructure) {
  var schemafieldElements = [];

  _.each(elementStructure, function(value, key) {
      var newElem;
      delete value._id;

      value.fieldName = _slugify(value.fieldName, value.name, true, false, false);
      value.slug = _slugify(value.name, 'none', true, true, true);

      if (value.__t == 'Component') {
        value.children = _schemafieldElements(value.children);
        newElem = new Elements.component(value);
      } else if (typeof Elements[value.__t.substr(0).toLowerCase()] != 'undefined') {
        newElem = new Elements[value.__t.substr(0).toLowerCase()](value);
      }

      if (newElem) {
        newElem.set('_id', mongoose.Types.ObjectId());
        schemafieldElements.push(newElem);
      }
    });

  return schemafieldElements;
};

var _buildPathKeyVal = function(pathKeyVal, path, data) {
  var allowedKeys = '|fieldName|slug|name|options|states|maxSize|sizeUnit|maxWidth|maxHeight|maxLength|allowed|versioning|isList|inEditor|description|method|query|request|body|header';

  for (var key in data) {
    if (allowedKeys.indexOf('|' + key) != -1) {
      pathKeyVal[schemaAttrName + '.' + path + '.' + key] = data[key];
    }
  }

  return pathKeyVal;
};

/**
* Creates an array that matches the path, list path segments are denoted as wildcard by 'x'
* @access private
*/
var _getPathMatchingArray = function(path, appData) {
  var arrayIndex = path.toString().replace(/.children/g, '').split('.');
  var match = [];

  // Creates a match array that has wildcard referncing path notiation.
  arrayIndex.reduce(function(result, currentVal, i) {
    var isList = false;
    if (result.d[currentVal].__t == 'Component' && result.d[currentVal].isList) {
      isList = true;
    }

    if (result.wasList) {
      match.push('x' + result.level);
      result.level++;
    } else {
      match.push(currentVal);
    }

    return {d: result.d[currentVal].children, wasList: isList, level: result.level};
  }, {d: appData, wasList: false, level: 0});

  return match;
};

var _recGetListElementPaths = function(appData, basePathArray, match, set) {
  appData.forEach(function(ele, i) {
    var thisArrayIndex = basePathArray.slice();
    thisArrayIndex.push(i);
    if (typeof ele.children != 'undefined' && ele.children.length > 0 && thisArrayIndex.length  <= match.length) {
      set = _recGetListElementPaths(ele.children, thisArrayIndex, match, set);
    }

    if (thisArrayIndex.length  == match.length) {
      if (_match(match, thisArrayIndex)) {
        set.push(thisArrayIndex.join('.children.'));
      }
    }
  });
  return set;
};

var _match = function(match, array) {
  var isMatch = true;

  for (var i = 0; i < match.length; i++) {
    if (array[i] == 0 && match[i].indexOf('x0') != -1) {
      isMatch = false;
    }
    if (match[i].indexOf('x') == -1 && match[i] != array[i]) {
      isMatch = false;
    }
  };

  return isMatch;
};

var _updateInheritedAttributes = function(appId, path, updateData, appData, Resource, action, fn) {

  let promise = new Promise((resolve, reject)=>{
    var match = _getPathMatchingArray(path, appData);
    if (match.join().indexOf('x') == -1 && action != 'delete') {
      resolve();
      return;
    }

    var set = _recGetListElementPaths(appData, [], match, []);
    var updateObj = {};

    if (action == 'delete') {
      var prototypePath = _getElementPath(appData, updateData._id.toString()).toString();
      var prototypeObj = _buildPathObj(prototypePath, appData);
      var parentObj = _buildPathObj(path.toString().replace(/.children$/, ''), appData);

      if (parentObj.isList && parentObj.children.length > 1) {
        var parentIsList = true;
      } else {
        var parentIsList = false;
      }
      prototypePath = prototypePath.split('.');
      var prototypeIndex = prototypePath[prototypePath.length - 1];
    }
    set.forEach(function(path, i) {
      if (action == 'insert') {
        updateObj[schemaAttrName + '.' + path + '.children'] = _schemafieldElements(updateData);
      } else if (action == 'update') {
        updateObj = _buildPathKeyVal(updateObj, path, updateData);
      } else if (action == 'delete') {
        var listEle = _buildPathObj(path + '.children.' + prototypeIndex, appData);
        if (parentIsList) {
          updateObj[schemaAttrName + '.' + path + '.children'] = [];
        }else if (listEle && listEle.fieldName == prototypeObj.fieldName) {
          updateObj[schemaAttrName + '.' + path + '.children'] = {_id: listEle._id};
        }
      } else if (action == 'copy') {
        updateObj[schemaAttrName + '.' + path + '.children'] = updateData;
      }
    });

    if (Object.keys(updateObj).length > 0) {
      if (action == 'update') {
        Resource.findOneAndUpdate({_id: appId}, {'$set': updateObj}, {'upsert': false}, function(err, data) {
            if (!err) {
              resolve();
            } else {
              reject(new Error('List structures were not updated.'));
            }
          }
        );
      } else if (action == 'insert') {
        Resource.findByIdAndUpdate({_id: appId}, {'$pushAll': updateObj}, function(err, data) {
          if (!err) {
            resolve();
          } else {
            reject(new Error('List structures were not inserted.'));
          }
        });
      } else if (action == 'delete') {
        var target = parentIsList ? {'$set': updateObj} : {'$pull': updateObj};
        Resource.findOneAndUpdate({_id: appId}, target, function(err, data) {
          if (!err) {
            resolve();
          } else {
            reject(new Error('List structures were not removed.'));
          }
        });
      } else if (action == 'copy') {
        Resource.findOneAndUpdate({_id: appId}, {'$pushAll': updateObj}, function(err, data) {
          if (!err) {
            resolve();
          } else {
            reject(new Error('List structures were not updated with copied schema.'));
          }
        });
      } else {
        resolve();
      }

    } else {
      resolve();
    }
  })
  return promise;
};

var _slugify = function(someName, defaultName, camelCase, useDash, lowercaseAll) {

  var sep = useDash ? '-' : ' ';

  if (typeof someName == 'undefined' || someName === null || someName === '') {
    someName = defaultName.replace(/[^\w_]+/g, sep).split(' ').reduce(function(prev, curr) {return camelCase ? prev + (curr.charAt(0).toUpperCase() + curr.slice(1)) : prev + curr;});
    someName = someName.charAt(0).toLowerCase() + someName.slice(1);
  } else {
    someName = someName.replace(/[^\w_]+/g, sep).split(' ').reduce(function(prev, curr) {return prev + curr;});
  }

  if (someName  === '') {
    someName = 'noSlug';
  }
  if (lowercaseAll) {
    return someName.toLowerCase();
  } else {
    return someName;
  }
};

module.exports = function(Resource, attr) {
  if (typeof attr === 'string') {
    schemaAttrName = attr;
  }

  return {
    // jscs:disable
    /** @function
    * @name setSchema
    * @public
    * @param {string} attr - App|Template|Compontnet
    * @description Set the type of resource to be worked on App|Template|Compontnet
    * @return {null} 
    *
    */
    // jscs:enable
    setSchema: function(attr) {
      schemaAttrName = attr;
    },

    // jscs:disable
    /** @function
    * @name get
    * @public
    * @param {object} data - default and meta data to create new resource
    * @param {object} fn callback
    * @description create new resource
    * @return {null} 
    *
    */
    // jscs:enable
    create: function(data, fn) {
      return Resource.findOne({title: data.title})
      .then((app)=>{
        if (app) {
          return Promise.reject(new Error('Title already used. Choose a distinct title.'));
        }
        if (typeof data.templateId != 'undefined' && data.templateId) {
          return resourceTemplate.findOne({_id: data.templateId}).then((template)=>{
            if (!template) {
              return Promise.reject(new Error('There is no template that can be used.'));
            } 
          })
        }
        if (typeof data.duplicateId != 'undefined' && data.duplicateId) {
          return Resource.findOne({_id: data.duplicateId}).then((dupApp)=>{
            if (!dupApp) {
              return Promise.reject(new Error('There is no app with this id.'));
            }
          })
        }
          
        return [];            
      })
      .then((appData)=>{
        data[schemaAttrName] = _schemafieldElements(appData);
        data.delete = false;
        data.state = 0;
        data.hooks = null;
        data.createdAt = moment().format('YYYY-MM-DDTHH:mm:ss');
        data.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss');
        return data;
      })
      .then((data)=>{
        var newApp = new Resource(data);
        return newApp.save();
      })
    },

    // jscs:disable
    /** @function
    * @name get
    * @public
    * @param {string} appId - application identifier
    * @param {object} fn callback
    * @description get apps or app by id
    * @return {null} 
    *
    */
    // jscs:enable
    get: function(id, config, fn) {
      if (typeof id != 'undefined' && id !== null) {
        return Resource.findOne({'$and': [{_id: id}, {delete: {'$ne': true}}]}).sort('createdAt -1').lean().exec()
        .then((apps)=>{
            return apps ? _structureData(apps, '_id', 'id', config) : {};
        });
      } else {
        var filter = {delete: {'$ne': true}};
        var by = {sort: {}};
        if (config.by) {
          by.sort[config.by] = 1;
          if (config.order == 'desc') {
            by.sort[config.by] = -1;
          }
        }
        return Resource.find(filter, '_id title description url state', by).sort('createdAt -1').lean().exec();
      }
    },

    // jscs:disable
    /** @function
    * @name updateMeta
    * @public
    * @param {string} appId - application identifier
    * @param {object} metaData - meta data to edit
    * @param {object} fn callback
    * @description Updata meta data of app
    * @return {null} 
    *
    */
    // jscs:enable
    updateMeta: function(appId, metaData, fn) {
      return Resource.findOne({_id: appId}).lean().exec()
        .then((app)=>{
          if (app === null) {
            return Promise.reject(new Error('Not application found with this id.'));
          }
        })
        .then(()=>{
          if (typeof metaData.hooks != 'undefined' && metaData.hooks.length > 3) {
            return Promise.reject(new Error('Cannot have more than 3 hooks.'));
          }
          ['appData','blueprints','_id','createdBy','__v','__t'].forEach((key)=>{
            if (typeof metaData[key] != 'undefined')
              delete metaData[key];
          });

          metaData.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss');
          return Resource.findOneAndUpdate({_id: appId}, {'$set': metaData}, {'upsert': true})
        })
    },

    // jscs:disable
    /** @function
    * @name delete
    * @public
    * @param {string} id - application identifier
    * @param {object} fn callback
    * @description Soft delete app
    * @return {null} 
    *
    */
    // jscs:enable
    delete: function(appId, fn) {
      return Resource.findOneAndUpdate({_id: appId}, {'$set': {delete: true}}, {'upsert': true});
    },

     // jscs:disable
    /** @function
    * @name addElement
    * @public
    * @param {object} elementStructure - element to add
    * @param {string} id - application identifier
    * @param {string} elId - id of element to add to
    * @param {object} fn callback
    * @description add element to another element
    * @return {null} 
    *
    */
    // jscs:enable
    addElement: function(elementStructure, id, elId, fn) {
      return Resource.findOne({_id: id}).lean().exec()
      .then((app)=>{
        if (app === null) {
          return Promise.reject(new Error('Not application found with this id.'));
        }
        if (app.schemaLock === true) {
          return Promise.reject(new Error('Schema has been locked in order to prevent editing.'));
        }

        let path = _getElementPath(app[schemaAttrName], elId);
        let compObj = _buildPathObj(schemaAttrName + '.' + path, app);

        if (compObj && compObj.isList == true && compObj.children.length > 0) {
          return Promise.reject(new Error('Cannot add structure to List. Prototype already exists.'));
        }

        if(!_isValidElement(elementStructure)){
          return Promise.reject(new Error('Not a valid structure.'));
        }

        if(id!=elId&&path===''){
          return Promise.reject(new Error('Could not find path.'));
        }

        return [path,app]
      })
      .then(([path,app])=>{
        let schemafiedElements = _schemafieldElements(elementStructure);
        let pathKeyVal = {};
        schemafiedElements = _schemafieldElements(elementStructure);
        // is at base of tree
        if (id == elId) {
          pathKeyVal[schemaAttrName] = schemafiedElements;
        } else {
          pathKeyVal[schemaAttrName + '.' + path + '.children'] = schemafiedElements;
        }

        let updatePromise = Resource.findByIdAndUpdate(id).update({_id: id},
            {'$pushAll': pathKeyVal,'$set': {updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss')}})
        if(path!==''){
          return updatePromise
          .then(()=>{
            return _updateInheritedAttributes(id, path, elementStructure, app[schemaAttrName], Resource, 'insert');
          })
        } else {
          return updatePromise;
        }
      });
    },

    // jscs:disable
    /** @function
    * @name removeElement
    * @public
    * @param {string} appId - application identifier
    * @param {string} elementId - id of element to remove
    * @param {object} fn callback
    * @description Remove element from app
    * @return {null} 
    *
    */
    // jscs:enable
    removeElement: function(appId, elementId, fn) {
      return Resource.findOne({_id: appId}).lean().exec()
      .then((app)=>{
        if (app === null) {
          return Promise.reject(new Error('Not application found with this id.'));
        }
        if (app.schemaLock === true) {
          return Promise.reject(new Error('Schema has been locked in order to prevent editing.'));
        }
        return app;
      })
      .then((app)=>{
        let path = _getElementPath(app[schemaAttrName], elementId);
        if(path == ''){
          return Promise.reject(new Error('Not a valid element.'));
        }

        let pathKeyVal = {};
        if (typeof path != 'number') {
          var lastIndexOf = path.lastIndexOf('.');
          path = path.substring(0, lastIndexOf);
          pathKeyVal[schemaAttrName + '.' + path] = {_id: mongoose.Types.ObjectId(elementId)};
        } else {
          pathKeyVal[schemaAttrName] = {_id: mongoose.Types.ObjectId(elementId)};
        }

        return Resource.findOneAndUpdate({_id: appId},
          {'$pull': pathKeyVal,'$set': {updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss')}})
        .then((data)=>{
          if (path.toString().indexOf('.children') === -1) {
            return Promise.resolve();
          }

          return _updateInheritedAttributes(appId, path, {_id: mongoose.Types.ObjectId(elementId)}, app[schemaAttrName], Resource, 'delete');
        });

      });
    },

    // jscs:disable
    /** @function
    * @name updateElementSet
    * @public
    * @param {string} appId - application identifier
    * @param {array} updateElements - array of elements to update
    * @param {string} elementId - id of element to edit
    * @param {object} fn callback
    * @description Update element's children set
    * @return {null} 
    *
    */
    // jscs:enable
    updateElementSet: function(appId, updateElements, elementId, fn) {
      Resource.findOne({_id: appId}).lean().exec(function(err, app) {
        if (app === null) {
          return fn({status: 'err', response: 'Not application found with this id.'});
        } else if (app.dataLock === true) {
          return fn({status: 'err', response: 'Data has been locked in order to prevent editing.'});
        } else {

          var modifiedElements = [];
          var pathkey = '';
          var componentElements = [];
          var updateElementException = {};

          if (appId != elementId) {
            var componentPath = _getElementPath(app[schemaAttrName], elementId);
            var componentObject = _buildPathObj(schemaAttrName + '.' + _getElementPath(app[schemaAttrName], elementId), app);
            componentElements = componentObject.children;
            pathkey = 'appData.' + componentPath + '.children';
          } else {
            componentElements = app.appData;
            pathkey = 'appData';
          }

          try {
            if (componentObject && componentObject.isList && updateElements[0]._id !== componentElements[0]._id.toString()) {
              updateElements.unshift(componentElements[0]);
              debug('Is list - copying prototype to data set at 0');
            }

            updateElements.forEach(function(uElem, uIndex) {
              var foundElement = false;
              componentElements.forEach(function(cElem, cIndex) {
                if (uElem && cElem._id.toString() == uElem._id.toString()) {
                  foundElement = true;
                  //use to check if data is stale
                  if (cElem.nonce.toString() != uElem.nonce.toString()) {
                    updateElementException.err = 'Input "' + cElem.name + '" has been updated by another user. Please refresh to review before updating.';
                    throw updateElementException;
                  }

                  if (cElem.__t != 'Component' && uElem._updated == true) {
                    cElem.value = uElem.value;
                    cElem.nonce = mongoose.Types.ObjectId();
                  } else if (cElem.__t == 'Component') {
                    // Edge Case sets children values for editor bc it shows the componest first set of children
                    cElem.children.forEach(function(cChild, cChildIndex) {
                      if (cChild.__t != 'Component') {
                        uElem.children.forEach(function(uChild, uChildIndex) {

                          if (cChild._id.toString() == uChild._id.toString()) {
                            if (uChild._updated == true) {
                              //use to check if data is stale
                              if (cChild.nonce.toString() != uChild.nonce.toString()) {
                                var staleComponentName = cElem.title ? cElem.title : cElem.name;
                                updateElementException.err = 'Input labeled "' + cChild.name + '" under component ' + staleComponentName + ' has been edited by another user. Please referesh the page and review before trying to update.';
                                throw updateElementException;
                              }
                              cChild.value = uChild.value;
                              cChild.nonce = mongoose.Types.ObjectId();
                            }
                          }
                        });
                      }

                      cElem.children[cChildIndex] = cChild;
                    });
                    if (updateElementException.err) {
                      throw updateElementException;
                    }
                  }

                  modifiedElements.push(cElem);
                }
              });
              if (!foundElement) {
                updateElementException.err = 'Input "' + uElem.name + '" cannot be found. An ordering error occured.';
                throw updateElementException;
              }
            });
          } catch (e) {
            if (e == updateElementException) {
              fn({status: 'err', response: updateElementException.err});
              return;
            } else {
              fn({status: 'err', response: 'Error updating set of data.'});
              return;
            }
          }

          var pathKeyVal = {};
          pathKeyVal[pathkey] = modifiedElements;
          pathKeyVal.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss');
          Resource.findOneAndUpdate({_id: appId}, {'$set': pathKeyVal}, {'upsert': false,new: true},
            function(err, data) {
              if (!err) {
                wsService.broadcast('updated', appId, data);
                fn({status: 'ok',response: 'Element set updated.'});
              } else {
                fn({status: 'err',response: 'Element set not updated.'});
              }
            }
          );
        }
      });
    },
    // jscs:disable
    /** @function
    * @name updateElement
    * @public
    * @param {string} appId - application identifier
    * @param {object} data - data to update to
    * @param {string} elementId - id of element to edit
    * @param {object} fn callback
    * @description Update elements data
    * @return {null} 
    *
    */
    // jscs:enable
    updateElement: function(appId, data, elementId, fn) {

      data.fieldName = _slugify(data.fieldName, data.name, true, false, false);
      data.slug = _slugify(data.name, 'none', false, true, true);

      let pathKeyVal = {};
      let path = ''
      return Resource.findOne({_id: appId}).lean().exec()
      .then((app)=>{
        if (app === null) {
          return Promise.reject(new Error('Not application found with this id.'));
        }
        if (app.dataLock === true) {
          return Promise.reject(new Error('Data has been locked in order to prevent editing.'));
        }

        path = _getElementPath(app[schemaAttrName], elementId);

        if((appId == elementId && path !== '') || (appId != elementId && path === '')) {
          return Promise.reject(new Error('Not a valid element.'));
        }

        pathKeyVal = _buildPathKeyVal(pathKeyVal, path, data);

        pathKeyVal[schemaAttrName + '.' + path + '.value'] = data.value;

        if (_.isEmpty(pathKeyVal)) {
          return Promise.reject(new Error('Not valid data to update to.'));
        }

        pathKeyVal.updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss');

        return app
      })
      .then((app)=>{
        return Resource.findOneAndUpdate({_id: appId}, {'$set': pathKeyVal}, {'upsert': false,new:true})
      })
      .then((resourceData)=>{
        return _updateInheritedAttributes(appId, path, data, resourceData[schemaAttrName], Resource, 'update');
      });
    },

    // jscs:disable
    /** @function
    * @name copyElementTo
    * @public
    * @param {string} appId - application identifier
    * @param {string} fromId - id of element to copy
    * @param {string} toId - id of compoenent to copy to
    * @param {object} fn callback
    * @description Copy element|component to a child of another component in app resource
    * @return {null} 
    *
    */
    // jscs:enable
    copyElementTo: function(appId, fromId, toId, fn) {
      return Resource.findOne({_id: appId}).lean().exec()
      .then((app)=>{
        if (app === null) {
          return Promise.reject(new Error('Not application found with this id.'));
        }
        if (app.schemaLock === true) {
          return Promise.reject(new Error('Schema has been locked in order to prevent editing.'));
        }

        var dupPath = _getElementPath(app[schemaAttrName], fromId);
        var targPath = _getElementPath(app[schemaAttrName], toId);
        var pathKeyVal = {};
        var duplicatingSubDoc = {};

        var compObj = _buildPathObj(schemaAttrName + '.' + targPath, app);
        if (typeof compObj != 'undefined' && compObj.isList == true && compObj.children.length > 0) {
          return Promise.reject(new Error('Cannot add structure to List. Prototype already exists.'));
        }

        duplicatingSubDoc = _buildPathObj(schemaAttrName + '.' + dupPath, app);
        if (appId == toId && dupPath !== '') {
          pathKeyVal[schemaAttrName] = _schemafieldElements([duplicatingSubDoc]);
        } else if (dupPath !== '' && targPath !== '') {
          pathKeyVal[schemaAttrName + '.' + targPath + '.children'] = _schemafieldElements([duplicatingSubDoc]);
        } else {
          return Promise.reject(new Error('Not a valid element.'));
        }

        let updatePromise = Resource.findByIdAndUpdate(appId).update({_id: appId},
              {'$pushAll': pathKeyVal,'$set': {updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss')}})

        if(dupPath !== '' && targPath !== ''){
          return updatePromise.then(()=>{
            return _updateInheritedAttributes(appId, targPath, _schemafieldElements([duplicatingSubDoc]), app[schemaAttrName], Resource, 'copy'); 
          })
        }else{
          return updatePromise;
        }

      });

    },
    // jscs:disable
    /** @function
    * @name addToList
    * @public
    * @param {string} appId - application identifier
    * @param {string} listId - component list id in application
    * @param {integer} index - index of list element|component to duplicate
    * @param {object} fn callback
    * @description Add or duplicate element or componenet to a list
    * @return {null} 
    *
    */
    // jscs:enable
    addToList: function(appId, listId, listIndex, fn) {
      return Resource.findOne({_id: appId}).lean().exec()
      .then((app)=>{
        if (app === null) {
          return Promise.reject(new Error('No application found with this id.'));
        }
        if (app.dataLock === true) {
          return Promise.reject(new Error('Data has been locked in order to prevent editing.'));
        }

        var listPath = _getElementPath(app[schemaAttrName], listId);
        var listComponent = _buildPathObj(schemaAttrName + '.' + listPath, app);

        if (listPath === '') {
          return Promise.reject(new Error('Not a valid list.'));
        }

        if (listComponent.maxSize > 0 && listComponent.children.length >= listComponent.maxSize) {
          return Promise.reject(new Error('Max number of elements reached.'));
        }

        if (typeof listComponent.children[listIndex] == 'undefined') {
          return Promise.reject(new Error('Not a valid list element.'));
        }

        return [listPath,listComponent];
      })
      .then(([listPath,listComponent])=>{
        var pathKeyVal = {};
        pathKeyVal[schemaAttrName + '.' + listPath + '.children'] = _schemafieldElements([listComponent.children[listIndex]]);

        return Resource.findByIdAndUpdate(appId).update({_id: appId},
        {'$pushAll': pathKeyVal,'$set': {updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss')}})

      });
    },
    // jscs:disable
    /** @function
    * @name removeFromList
    * @public
    * @param {string} appId - application identifier
    * @param {string} listId - component list id in application
    * @param {integer} index - index of list element|component to remove
    * @param {object} fn callback
    * @description Removes element or componenet form a list
    * @return {null} 
    *
    */
    // jscs:enable
    removeFromList: function(appId, listId, index, fn) {
      if (index === 0 || index == 0) {
        return Promise.reject(new Error('Cannot remove the first element. It is a prototype'));
      }
      return Resource.findOne({_id: appId}).lean().exec()
      .then((app)=>{
        if (app === null) {
          return Promise.reject(new Error('Not application found with this id.'));
        }
        if (app.dataLock === true) {
          return Promise.reject(new Error('Data has been locked in order to prevent editing.'));
        }

        var listPath = _getElementPath(app[schemaAttrName], listId);

        var listComponent = _buildPathObj(schemaAttrName + '.' + listPath, app);

        if (listPath === '') {
          return Promise.reject(new Error('Not a valid list.'));
        }

        if (typeof listComponent.isList === 'undefined' || listComponent.isList === false) {
          return Promise.reject(new Error('Not a valid list.'));
        }

        if (typeof listComponent.children[index] == 'undefined') {
          return Promise.reject(new Error('Not a valid list element.'));
        }

        var pathKeyVal = {};
        pathKeyVal[schemaAttrName + '.' + listPath + '.children'] = {_id: mongoose.Types.ObjectId(listComponent.children[index]._id)};

        return Resource.findByIdAndUpdate(appId).update({_id: appId},
          {'$pull': pathKeyVal,'$set': {updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss')}})
      });
    }
  };
};
