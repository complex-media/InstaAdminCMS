/**
 * Service used to upload files to s3 and handdle naming and validation of files
 * @module uploaderService
 */
var fs = require('fs');
var S3FS = require('s3fs');
var cdnConfig = require('../config/index.js');
var Elements = require('../models/elements');
var path = require('path');
var mime = require('mime-types');

var s3fsImpl = new S3FS(cdnConfig.S3_BUCKET, {
  accessKeyId: cdnConfig.S3_ACCESS_KEY_ID,
  secretAccessKey: cdnConfig.S3_SECRET_ACCESS_KEY
});

// Create our bucket if it doesn't exist
// s3fsImpl.create();
// jscs:disable
/** @function
* @private
* @param {string} filename - filename of the file
* @param {string} id - app id file is related to
* @param {string} uploadType - Element type the file refers to.
* @param {boolean} useVersioning - whether to append a version number for incremental uploads
* @param {object} fn - callback function
* @description Builds a string of the url endpoint of the file that will be uploaded.
* @return {null}
*
*/
// jscs:enable
function _buildKey(filename, id, uploadType, useVersioning, fn) {

  if (typeof process.env.NODE_ENV == 'undefined' || (process.env.NODE_ENV != 'production' && process.env.NODE_ENV != 'development')) {
    id = 'instaadmin-local-' + id;
  }

  if (useVersioning) {
    s3fsImpl.listContents([id,uploadType].join('/'), '/', function(err, files) {
      var uFile = path.parse(filename);
      if (files.length !== 0) {
        var version = 1;
        files.forEach(function(file) {
          var iFile = path.parse(file.Key);
          var bfile = iFile.name.split('-v');
          if (bfile.length > 1 && uFile.name == bfile[0] && iFile.ext == uFile.ext && parseInt(bfile[1]) >= version) {
            version = parseInt(bfile[1]) + 1;
          }
        });
        fn(null, [id,uploadType, uFile.name + '-v' + version + uFile.ext].join('/'));
      } else {
        fn(null, [id,uploadType, uFile.name + '-v1' + uFile.ext].join('/'));
      }
    },function(error){console.log('s3ListContentError',error)});
  } else {
    fn(null, [id,uploadType,filename].join('/'));
  }
}
// jscs:disable
/** @function
* @private
* @param {object} file - upload file object
* @param {object} config - configuration to be used on uploaded file
* @description Uses config object to check against file properties to return a reason or validates file
* @return {boolean|string} returns false or reason why this is an invalid file
*
*/
// jscs:enable
function _inValid(file, config) {

  var stats = fs.statSync(file.path);
  var fileSize = stats.size;
  var maxSize = (typeof config.maxSize != 'undefined') ? config.maxSize : 500 ;
  var sizestring = (typeof config.maxSize != 'undefined') ? config.maxSize : 500 ;
  if (config.sizeUnit == 'MB') {
    maxSize = maxSize * 1000000.0;
  } else {
    config.sizeUnit = 'KB';
    maxSize = maxSize * 1000.0;
  }
  var reason = [];

  if (fileSize >= maxSize) {
    reason.push('Size should be less than ' + sizestring + ' ' + config.sizeUnit + '.');
  }

  if (typeof Elements[config.uploadType.toLowerCase()] != 'undefined' && typeof Elements[config.uploadType.toLowerCase()].uploadValidate != 'undefined') {
    var inValid = Elements[config.uploadType.toLowerCase()].uploadValidate(config, file, stats);
    if (inValid)
      reason.push(inValid);
  }

  return reason.length !== 0 ? reason.join(' ') : false ;
}

function _dfFined(nodeList,subNodeId){
  var returnNode = null;
  for (var i = 0; i < nodeList.length; i++) {
    if(nodeList[i]._id == subNodeId){
      return nodeList[i];
    }
    if(nodeList[i].__t == 'Component'){
      returnNode = _dfFined(nodeList[i].children,subNodeId);
    }

    if(returnNode) {
      return returnNode;
    }
  }
  return returnNode;
}

module.exports = {
  // jscs:disable
  /** @function
  * @public
  * @name uppload
  * @todo config param shoudl be done on server not passed from frontend
  * @param {object} file - upload file object
  * @param {object} config - configuration to be used on uploaded file
  * @param {object} next - callback function
  * @description Uploads a file to s3, creates path based on appid and name of file with versioning
  * @return {null} 
  *
  */
  // jscs:enable
  upload: function(file, app, config, next){
    if(config.eId && config.appId){
      var element = _dfFined(app.appData,config.eId);
      if(!element){
        return next({status: 'err',response: 'Problem uploading to CDN. No element found.'});
      }
      element.uploadType = element.__t;
      this.uploadDepricate(file, element, next);
    } else {
      next({status: 'err2',response: 'weesp'});
      this.uploadDepricate(file, config, next);
    }
  },

  uploadDepricate: function(file, config, next) {
    var inValid = _inValid(file, config);

    if (inValid) {
      next({status: 'err',response: inValid});
      return;
    }

    var useVersioning = (typeof config.versioning != 'undefined' && (config.versioning === true || config.versioning == 'true')) ? true : false;

    _buildKey(file.originalname, config.appId, config.uploadType.toLowerCase(), useVersioning, function(err, key) {
      if (err) {
        next({status: 'err',response: 'Problem building CDN path to file.'});
        return;
      }

      var contentType = mime.contentType(file.mimetype);

      if (!contentType) {
        fs.unlink(file.path, function(err2) {
          if (err2) {
            console.error('Did not remove File to ', err2);
          }
        });
        return next({status: 'err',response: 'Problem with the ContentType of uploaded file. ' + file.mimetype + ' is not correct.'});
      }

      var stream = fs.createReadStream(file.path);
      s3fsImpl.writeFile(key, stream, {ACL: 'public-read', 'ContentType': contentType}, function(err1) {
        fs.unlink(file.path, function(err2) {
          if (err2) {
            console.error('Did not upload File to ', err2);
          }
        });

        if (err1) {
          next({status: 'err',response: 'Problem uploading to CDN.'});
        } else {
          next({status: 'ok',response: 'Uploaded.',data: cdnConfig.cdnBase + '/' + key});
        }
      },function(error){console.log('s3ListContentError',error)});
    });
  }
};
