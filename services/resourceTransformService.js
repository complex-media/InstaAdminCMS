/**
 * Use to structure resource data in a human readable way
 * @module resourceTransformService
 * @todo merge with componenteSErvice elementForservice and temporaray-resource-moduel
 */
 var marked = require('marked');

// jscs:disable
/** @deprecteated
* @private
* @description use get element value based on slash path of url
*/
// jscs:enable
// function _getValueBySlugPath(data, path) {
//   if (path.substr(-1) === '/') {
//     path =  path.substr(0, path.length - 1);
//   }
//   var pathArray = path.split('/');
//   var pathExists = true;
//   var pathCt = 0;

//   if (pathArray.length < 1 || path === '') {
//     return data;
//   }

//   pathLoop:
//   for (var i = 0, n = pathArray.length; i < n; ++i) {
//     var pathSlug = pathArray[i];
//     for (var slug in data) {
//       // if object slug = to the path  and this is the final path, this is the targeted object we want
//       if (slug == pathSlug) {
//         data = data[slug];
//       } else if (data.constructor === Array && typeof data[parseInt(pathSlug)] !== undefined && parseInt(pathSlug) == parseInt(slug)) {
//         data = data[slug];
//       }

//       if (slug == pathSlug && i == pathArray.length - 1) {
//         break pathLoop;
//       } else if (slug == pathSlug || (typeof data[parseInt(pathSlug)] !== undefined && parseInt(pathSlug) == parseInt(slug))) {
//         continue pathLoop;
//       }
//     }
//     pathExists = false;
//   }

//   return (pathExists) ? data : null;
// }
// jscs:enable

 // jscs:disable
  /** @function
  * @private
  * @params {array} tree structure data
  * @params {boolean} use slug as identifier not fieldname
  * @params {boolean} return array or object
  * @description Recursively modifies resource tree elements for better json readability
  * @return {object} return modified object resource tree for better human readability
  */
  // jscs:enable
function _recObjBuild(data, useSlugAsKey, returnArray) {
  //Normalize data format
  if (data.constructor !== Array) {
    data = [data];
  }

  var temp = returnArray ? [] : {};

  data.forEach(function(thisObj) {
    // build dictionary key based on slug or fieldname
    var fieldName = useSlugAsKey ? thisObj.slug : thisObj.fieldName;

    // whether children data should be and array or object fomat
    var objReturnArray = (thisObj.__t == 'Component' && thisObj.isList) ? true : false;

    // data to return
    var returnData = (thisObj.__t == 'Component')  ?  _recObjBuild(thisObj.children, useSlugAsKey, objReturnArray) : _clean(thisObj.value, thisObj.__t);

    // takeing first element if is list , first element is protoype
    if (returnData && returnData.constructor === Array && returnData.length > 0) {
      returnData.shift();
    }

    if (temp.constructor === Array) {
      temp.push(returnData);
    } else {
      temp[fieldName] = returnData;
    }
  });

  return temp;
}
 // jscs:disable
  /** @function
  * @private
  * @todo remove slug
  * @param {string} value - some value
  * @param {string} type - element type
  * @description does specific filter and or modification to value based on type
  * @return {string}  cleaned value
  */
  // jscs:enable
function _clean(value, type) {
  if (type == 'Markdown' && typeof value != 'undefined') {
    return marked(value);
  } else {
    return value;
  }
}

function _getModifiedResource(resource, useSlugAsKey) {
  var dataModified = {id: resource._id,description: resource.description,title: resource.title};
  dataModified.appData = _recObjBuild(resource.appData, useSlugAsKey, false);
  return dataModified;
}

module.exports = {
  // jscs:disable
  /** @deprecteated
  * @public
  * @description use get element value based on slash path of url
  */
  // jscs:enable
  // getValueBySlugPath: function(resource, path, fn) {
  //   var modResource = _getModifiedResource(resource, true);
  //   fn(_getValueBySlugPath(modResource.appData, path));
  // },

  // jscs:disable
  /** @function
  * @name getModifiedResource
  * @public
  * @todo remove slug
  * @param {object} resource - app resource object
  * @param {boolean} useFieldNameForArray - whether to use field name or a slug
  * @param {object} fn - callback function
  * @description modifies resource app object for more human readble json
  * @return null
  */
  // jscs:enable
  getPretty: function(resource, useSlugAsKey) {
    let promise = new Promise((resolve, reject)=>{
      let data = _getModifiedResource(resource, useSlugAsKey);
      resolve(data);
    })
    return promise;
  }
};
