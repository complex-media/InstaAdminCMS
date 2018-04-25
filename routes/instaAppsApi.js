var express = require('express');
var router = express.Router();
var users = require('../models/user.js');
var aclMiddleWare = require('../middlewares/aclMiddleWare.js');
var resourceApp = require('../models/resources/resource-app.js');
var resourceService = require('../services/resourceService.js')(resourceApp);
var resourceTransformService = require('../services/resourceTransformService.js');
var uploaderService = require('../services/uploaderService.js');
var hooks = require('../services/hookService.js');
var multer  = require('multer');
var upload = multer({dest: '/tmp'});
var Q = require('q');
var email = require('../services/emailService.js');
var ejs = require('ejs');
var fs = require('fs');
var config = require('../config/index.js');
var mongoose = require('mongoose');

// @deprecteated
// Used to get the dot path value of an app's data
// Never had a use case
// router.get('/applications/:resourceId/path/:input(*)', function(req, res, next) {
//   res.setHeader('Content-Type', 'application/json');
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   if (typeof req.params.input == 'undefined') {
//     return res.send({status: 'err',response: 'No path.'});
//   }

//   resourceApp.findOne({'$and': [{_id: req.params.resourceId},{delete: {'$ne': true}}]}).exec(function(err, app) {
//     if (err) {
//       return res.send({status: 'err',response: 'No data found.'});
//     } else {
//       resourceTransformService.getValueBySlugPath(app, req.params.input, function(data) {
//         return res.send({status: 'ok',response: 'Recieved.',data: data});
//       });
//     }
//   });
// });
// jscs:disable
 /**
   * @swagger
   * /applications/{resourceId}/object:
   *   get:
   *     tags:
   *       - Applications
   *     description: Get application data formatted 
   *     parameters:
   *       - in: path
   *         name: resourceId
   *         description: Id of resource
   *         required: true
   *         schema:
   *           type: string
   *     produces:
   *       - application/json
   *     responses:
   *       401:
   *         $ref: "#/definitions/unAuthorizedModel"
   *       200:
   *         description: 'Response with formatted data.'
   *         type: object
   *         properties:
   *           status:
   *             type: string
   *             enum: [ok,err]
   *           response:
   *             type: string
   *             description: "Reason for type of response"
   *           data:
   *             type: object
   *             additionalProperties:
   *               type: [object , array, string, boolean , integer]
   */
/**
 * @api {get} /v1/applications/:resourceId/object GetApplicationFormatted
 * @apiDescription Request formated application resource
 * @apiName GetApplicationFormatted
 * @apiGroup Applications
 * @apiParam {string} resourceId Application unique ID.
 *
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiSuccess {String} data  Formated version for the resource.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.get('/applications/:resourceId/object', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  resourceApp.findOne({'$and': [{_id: req.params.resourceId, __t: "App"},{delete: {'$ne': true}}]}).exec()
  .then((app)=>{
    return resourceTransformService.getPretty(app, false)
  })
  .then((data)=>{
    return res.send({status: 'ok',response: 'Recieved.',data: data});
  })
  .catch((err)=>{
    return res.send({status: 'err',response: 'No data found.',moreErr:err.message});
  });
});
// jscs:disable
//TODO REFACTOR config should be searched on in appdata;
/**
   * @swagger
   * /applications/{resourceId}/upload:
   *   post:
   *     tags:
   *       - Applications
   *     description: Get application data formatted 
   *     consumes:
   *       - multipart/form-data  # and/or application/x-www-form-urlencoded
   *     parameters:
   *       - in: path
   *         name: resourceId
   *         description: Id of resource
   *         required: true
   *         schema:
   *           type: string
   *       - in: formData
   *         name: file
   *         description: The uploaded file data
   *         required: true
   *         type: file
   *       - in: formData
   *         name: appId
   *         description: config appid
   *         required: true
   *         type: string
   *       - in: formData
   *         name: versioning
   *         description: config isversioning
   *         required: true
   *         type: boolean
   *       - in: formData
   *         name: uploadType
   *         description: config type
   *         required: true
   *         enum: [Image,Resource]
   *       - in: formData
   *         name: allowed[0]
   *         description: config allowed format eg jpg
   *         required: true
   *         type: string
   *     produces:
   *       - application/json
   *     responses:
   *       401:
   *         $ref: "#/definitions/unAuthorizedModel"
   *       200:
   *         description: 'Response with formatted data.'
   *         type: object
   *         properties:
   *           status:
   *             type: string
   *             enum: [ok,err]
   *           response:
   *             type: string
   *             description: "Reason for type of response"
   *           data:
   *             type: string
   *             desription: path of file in cdn
   */
/**
 * @api {post} /v1/applications/:resourceId/upload UploadApplicationFile
 * @apiDescription Upload Files to Application Cdn
 * @apiName UploadApplicationFile
 * @apiGroup Applications
 * @apiParam {string} resourceId Application unique ID.
 * @apiParam {string} appId Id of application to use as name for categorizing files in cdn
 * @apiParam {number} maxSize Max mb size of upload.
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.post('/applications/:resourceId/upload', aclMiddleWare(null, null, 'upload'), upload.any(), function(req, res, next) {
  resourceApp.findOne({'$and': [{_id: req.params.resourceId},{delete: {'$ne': true}}]}).exec()
  .then((app)=>{
    if (!app) {
      return res.send({status: 'err',response: 'No application found to upload to.'});
    } else if(req.files.length === 0) {
      return res.send({status: 'err',response: 'No file to upload.'});
    } else {
      uploaderService.upload(req.files[0],app, req.body, function(resp) {
        return res.send(resp);
      });
    }
  });
});
// jscs:disable
 /**
   * @swagger
   * /applications:
   *   get:
   *     tags:
   *       - Applications
   *     description: Get applications list 
   *     produces:
   *       - application/json
   *     responses:
   *       401:
   *         $ref: "#/definitions/unAuthorizedModel"
   *       200:
   *         description: Standard response
   *         schema:
   *          type: object
   *          properties:
   *            status:
   *              type: string
   *              enum: [ok,err]
   *            response:
   *              type: string
   *              description: Reason for type of response
   *            data:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                  _id:
   *                    type: string
   *                  title:
   *                    type: string
   *                  description:
   *                    type: string
   *                  state:
   *                    type: integer
   *                  __t:
   *                    type: string
   *                    enum: [Template,App,Component]
   *                  url:
   *                    type: string
   *                  userRole:
   *                    type: string
   *                    enum: [admin, user, owner,guest]
   *           
   */
/**
 * @api {get} /v1/applications GetApplications
 * @apiDescription Get list of applications
 * @apiName GetApplications
 * @apiGroup Applications
 * 
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiSuccess {json} data  List of applications.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.get('/applications', aclMiddleWare(), function(req, res, next) {

    let qry = {};
    if (req.query.order) {
      qry.order = req.query.order;
    }
    if (req.query.by) {
      qry.by = req.query.by;
    }

    let resources = resourceService.get(undefined, qry)
    .then((data)=>{
      if (!data) {
        return Promise.reject(new Error('No apps found.'));
      }
      return data;
    })

    let roles = req._acl.userRoles(req.user._id.toString() + '-' + req.user.local.email)
    .then((roles)=>{
      return roles
    })

    Promise.all([resources,roles])
    .then(([resources,roles])=>{
      var modData = [];
        if (roles.length > 0) {

          if (roles.join().indexOf('admin') !== -1) {
            modData = resources.map(function(app) {app.userRole = 'admin'; return app;});
          } else {
            resources.forEach(function(app) {
              roles.forEach(function(role) {
                if (role.indexOf(app._id.toString()) !== -1) {
                  app.userRole = role.replace('-' + app._id.toString(), '');
                  modData.unshift(app);
                }
              });
            });
          }
        }
        return modData;
    })
    .then((modData)=>{
      return res.send({status: 'ok',response: 'Recieved.',data: modData});
    })
    .catch((err)=>{
      return res.send({status: 'err',response: 'Not recieved.',moreErr: err.message});
    })
    
  });
// jscs:disable
/**
   * @swagger
   * /applications/{resourceId}/user:
   *   get:
   *     tags:
   *       - Applications
   *     description: Get applications list
   *     parameters:
   *       - in: path
   *         name: resourceId
   *         description: Id of resource
   *         required: true
   *         schema:
   *           type: string 
   *     produces:
   *       - application/json
   *     responses:
   *       401:
   *         $ref: "#/definitions/unAuthorizedModel"
   *       200:
   *         description: Standard response
   *         schema:
   *          type: object
   *          properties:
   *            status:
   *              type: string
   *              enum: [ok,err]
   *            response:
   *              type: string
   *              description: Reason for type of response
   *            data:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                  _id:
   *                    type: string
   *                  handle:
   *                    type: string
   *                  role:
   *                    type: string
   *           
   */
/**
 * @api {get} /v1/applications/:resourceId/user GetApplicationUsers
 * @apiDescription Get list of users that have access to application
 * @apiName GetApplicationUsers
 * @apiGroup Applications
 * @apiParam {string} resourceId Application unique ID.
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiSuccess {json} data  List of users.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.get('/applications/:resourceId/user' ,  aclMiddleWare(), function(req, res, next) {
  var aclUsers = [];
  var mergeUsers = function(users, role) {
    aclUsers = aclUsers.concat(users.map(function(user) {
      return {
        _id: user.split(/-(.+)?/)[0],
        handle: user.split(/-(.+)?/)[1],
        role: role
      };
    }));
  };

  Q.all([
    req._acl.roleUsers('owner-' + req.params.resourceId),
    req._acl.roleUsers('developer-' + req.params.resourceId),
    req._acl.roleUsers('editor-' + req.params.resourceId),
    req._acl.roleUsers('guest-' + req.params.resourceId)
  ]).spread(function() {
    var roles = ['owner','developer','editor','guest'];
    for (var i = 0; i < arguments.length; i++) {
      mergeUsers(arguments[i], roles[i]);
    }
  }).fin(function() {
    return res.send({status: 'ok',response: 'Recieved users.',data: aclUsers});
  });
});
// jscs:disable
/**
 * @swagger
 * /applications/{resourceId}/user:
 *   put:
 *     tags:
 *       - Applications
 *     description: Update users permission of an application
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         descripti  on: Id of resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: user update data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: user id
 *                 role:
 *                   type: string
 *                   description: old role
 *                   enum: [owner , developer, guest, editor]
 *                 originalRole:
 *                   type: string
 *                   description: new role
 *                   enum: [owner , developer, guest, editor]
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *         $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         $ref: "#/definitions/standardResponseModel"
 *           
 */
/**
 * @api {put} /v1/applications/:resourceId/user UpdateApplicationUser
 * @apiDescription Update users permission of an application
 * @apiName UpdateApplicationUsers
 * @apiGroup Applications
 * @apiParam {string} resourceId Application unique ID.
 * @apiParam {string} user.role New role of user.
 * @apiParam {string} user._id User unique ID.
 * @apiParam {string} user.originalRole Original role of user.
* @apiParamExample {json} New User:
                { "user": {"role":"guest","_id":"uniqe user id","originalRole":"developer"}}
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.put('/applications/:resourceId/user' , aclMiddleWare(), function(req, res, next) {
  if (typeof req.body.user._id && req.body.user.role && req.body.user.originalRole) {
    if ('owner|developer|editor|guest'.indexOf(req.body.user.role) === -1 && 'owner|developer|editor|guest'.indexOf(req.body.user.originalRole) === -1) {
      return res.send({status: 'err',response: 'User role doesn\'t exist.'});
    }

    req._acl.roleUsers('developer-' + req.params.resourceId, function(err, rUsers) {
      if (rUsers.join().indexOf(req.user._id.toString() + '-' + req.user.local.email) !== -1 && (req.body.user.role == 'owner' || req.body.user.originalRole == 'owner')) {
        return res.send({status: 'err',response: 'Developers access cannot set or change owner permissions.'});
      } else {
        users.findOne({_id: req.body.user._id}, function(err, user) {
          if (err || !user) {return res.send({status: 'ok',response: 'User could not be found.'});}

          req._acl.roleUsers('owner-' +  req.params.resourceId, function(err, users) {

            if (users.length < 2 && req.body.user.role != 'owner' && req.body.user.originalRole == 'owner') {
              return res.send({status: 'err',response: 'App requires at least one owner.'});
            }
            req._acl.removeUserRoles(user._id + '-' + user.local.email, req.body.user.originalRole + '-' +  req.params.resourceId, function(err) {
              if (err) {
                return res.send({status: 'err',response: 'User role added could not be removed.'});
              }

              req._acl.addUserRoles(user._id + '-' + user.local.email, req.body.user.role + '-' +  req.params.resourceId, function(err) {
                if (!err) {
                  return res.send({status: 'ok',response: 'User role updated.'});
                } else {
                  return res.send({status: 'err',response: 'User role could not be updated.'});
                }
              });
            });
          });
        });
      }
    });

  } else {
    return res.send({status: 'err',response: 'No user submitted.'});
  }
});
// jscs:disable
/**
 * @swagger
 * /applications/{resourceId}/user:
 *   post:
 *     tags:
 *       - Applications
 *     description: Add users permission of an application
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         descripti  on: Id of resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: user update data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newUser:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: user id
 *                 role:
 *                   type: string
 *                   description: old role
 *                   enum: [owner , developer, guest, editor]
 *                 originalRole:
 *                   type: string
 *                   description: new role
 *                   enum: [owner , developer, guest, editor]
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *         $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         $ref: "#/definitions/standardResponseModel"
 *           
 */
/**
 * @api {post} /v1/applications/:resourceId/user AddApplicationUser
 * @apiDescription Add users to application permissions
 * @apiName AddApplicationUser
 * @apiGroup Applications
 * @apiParam {string} resourceId Application unique ID.
 * @apiParam {string} newUser.role New role of user.
 * @apiParam {string} newUser._id User unique ID.
 * @apiParamExample {json} New User:
                 { "newUser": {"role":"guest","_id":"uniqe user id"}}
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.post('/applications/:resourceId/user' , aclMiddleWare(), function(req, res, next) {
  if (typeof req.body.newUser.id && req.body.newUser.role) {
    if ('owner|developer|editor|guest'.indexOf(req.body.newUser.role) === -1) {
      return res.send({status: 'err',response: 'User role doesn\'t exist.'});
    }

    req._acl.roleUsers('developer-' + req.params.resourceId, function(err, rUsers) {
      if (rUsers.join().indexOf(req.user._id.toString() + '-' + req.user.local.email) !== -1 && (req.body.newUser.role == 'owner' || req.body.newUser.originalRole == 'owner')) {
        return res.send({status: 'err',response: 'Developers access cannot set owner permissions.'});
      } else {
        users.findOne({_id: req.body.newUser.id}, function(err, user) {
          if (err) {return res.send({status: 'ok',response: 'User could not be found.'});}

          req._acl.addUserRoles(user.id + '-' + user.local.email, req.body.newUser.role + '-' +  req.params.resourceId, function(err) {
            if (err) {
              return res.send({status: 'err',response: 'User role could not be added.'});
            } else {
              var file = fs.readFileSync(process.cwd() + '/views/authentication/resource-acces-granted.ejs', 'ascii');
              var confirmRender = ejs.render(file, {role: req.body.newUser.role, appId: req.params.resourceId,appTitle: req.body.appTitle, loginlink: config.adminUrl + '/dashboard/applications/' + req.params.resourceId + '/editor/'});
              email.send({
                from: '"Insta Admin Invite" <no-reply@rnd.example.com>', // sender address
                to: user.local.email, // list of receivers
                subject: 'Insta Admin - Resource permission granted.',
                html: confirmRender // html body
              })
              .then(()=>{
                return res.send({status: 'ok',response: 'User role added.'});
              })
              .catch((err)=>{
                return res.send({status: 'err',response: 'User role added but email not sent.',moreMsg:err.message});
              });
            }
          });
        });
      }
    });
  } else {
    return res.send({status: 'err',response: 'No user submitted.'});
  }
});
// jscs:disable
 /**
   * @swagger
   * /applications/{resourceId}/user:
   *   delete:
   *     tags:
   *       - Applications
   *     description: remove users permission of an application
   *     parameters:
   *       - in: path
   *         name: resourceId
   *         descripti  on: Id of resource
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: role
   *         description: role of user
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: userid
   *         description: id of user
   *         required: true
   *         schema:
   *           type: string
   *     produces:
   *       - application/json
   *     responses:
   *       401:
   *         $ref: "#/definitions/unAuthorizedModel"
   *       200:
   *         $ref: "#/definitions/standardResponseModel"
   *           
   */
/**
 * @api {delete} /v1/applications/:resourceId/user DeleteApplicationUser
 * @apiDescription Delete users in application permissions
 * @apiName DeleteApplicationUser
 * @apiGroup Applications
 * @apiParam {string} resourceId Application unique ID.
 * @apiParam {string} userid User unique ID.
 * @apiParam {string} role User role.
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.delete('/applications/:resourceId/user', aclMiddleWare(), function(req, res, next) {
  if (typeof req.query.userid && req.query.role) {
    users.findOne({_id: req.query.userid}, function(err, user) {
      if (err) {return res.send({status: 'ok',response: 'User could not be found.'});}

      req._acl.roleUsers('owner-' +  req.params.resourceId, function(err, users) {
        if (users.length < 2 && req.query.role == 'owner') {
          return res.send({status: 'err',response: 'App requires at least one owner.'});
        }
        req._acl.removeUserRoles(user._id + '-' + user.local.email, req.query.role + '-' +  req.params.resourceId, function(err) {
          if (err) {
            return res.send({status: 'err',response: 'User role could not be removed.'});
          } else {
            return res.send({status: 'ok',response: 'User role removed.'});
          }
        });
      });

    });

  } else {
    return res.send({status: 'err',response: 'No user submitted.'});
  }
});
// jscs:disable
/**
 * @swagger
 * /applications/{resourceId}/element/{elementId}:
 *   put:
 *     tags:
 *       - Applications
 *     description: update element data
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         description: Id of resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: elementId
 *         description: Id of data element new element structure will post to
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: formData
 *         description: Structure of update element
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             updateSet:
 *               type: boolean
 *               description: update
 *             data:
 *               type: object
 *               items:
 *                 type: object
 *                 properties:
 *                   __t:
 *                     type: string
 *                     enum: [Html,Image,Text,ElementType...]
 *                   name:
 *                     type: string
 *                     description: new elements nice name
 *                   fieldName:
 *                     type: string
 *                     description: new elements field name
 *                   value:
 *                     type: string
 *                     description: new elements default value
 *               properties:
 *                 __t:
 *                   type: string
 *                   enum: [Html,Image,Text,ElementType...]
 *                 name:
 *                   type: string
 *                   description: new elements nice name
 *                 fieldName:
 *                   type: string
 *                   description: new elements field name
 *                 value:
 *                   type: string
 *                   description: new elements default value
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *         $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         $ref: "#/definitions/standardResponseModel"
 *           
 */
/**
 * @api {put} /v1/applications/:resourceId/element/:elementId UpdateApplicationElement
 * @apiDescription Update an element of the applications heirarchy
 * @apiName UpdateApplicationElement
 * @apiGroup Applications
 * @apiParam {string} resourceId Application unique ID.
 * @apiParam {string} elementId Element unique ID.
 * @apiParam {string} updateSet Update a set of elements under a single hierarchy.
 * @apiParam {json} data Array of element data or single object of element data.
 * @apiParam {array} data Array of element data or single object of element data.
 * @apiParamExample {array} data:
                 [{"_id":"elementid","value":"someValue","fieldName":"someElementfieldname","name":"some element name"},{"_id":"elementid","value":"someValue","fieldName":"someElementfieldname","name":"some element name"}]
 * @apiParamExample {json} data:
                 {"_id":"elementid","value":"someValue","fieldName":"someElementfieldname","name":"some element name"}
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.put('/applications/:resourceId/element/:elementId', aclMiddleWare(), function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  //Checks that are in baserouter need to be applied to this route -  BEGIN
  if (typeof req.body.useSchema && (req.body.useSchema == 'appData' || req.body.useSchema == 'blueprints')) {
    resourceService.setSchema(req.body.useSchema);
  }
  if (typeof req.query.useSchema && (req.query.useSchema == 'appData' || req.query.useSchema == 'blueprints')) {
    resourceService.setSchema(req.query.useSchema);
  }
  if (!req.isAuthenticated()) {
    return res.send({status: 'err',response: 'Not authorized. Please login'});
  }
  //Checks that are in baserouter need to be applied to this route - END

  if (typeof req.body.updateSet !== 'undefined' && req.body.updateSet === true) {
    if (typeof req.body.data === 'undefined' || req.body.data.length === 0) {
      return res.send({status: 'err',response: 'No data to update'});
    }

    // test add element test add componenet
    resourceService.updateElementSet(req.params.resourceId, req.body.data, req.params.elementId, function(data) {
      res.send(data);
    });
  } else {
    if (typeof req.body.data.fieldName == 'undefined' && typeof req.body.data.name == 'undefined' && typeof req.body.data.value == 'undefined') {
      return res.send({status: 'err',response: 'No data to update'});
    }

    if (typeof req.body.data.value != 'undefined' && req.body.data.value != null && req.body.data.__t == 'Component') {
      req.body.data.value = null;
    }

    // test add element test add componenet
    resourceService.updateElement(req.params.resourceId, req.body.data, req.params.elementId)
    .then(()=>{
      res.send({status:'ok',repsonse:'Element updated.'});
    })
    .catch((err)=>{
      res.send({status:'err',repsonse:'Element not updated',moreMsg:err.message});
    });
  }
});
// jscs:disable
/**
 * @swagger
 * /applications/{resourceId}/publish:
 *   get:
 *     tags:
 *       - Applications
 *     description: Runs publishing callbacks for app 
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         descripti  on: Id of resource
 *         required: true
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *         $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         $ref: "#/definitions/standardResponseModel"
 *           
 */
// jscs:enable
router.get('/applications/:resourceId/publish', aclMiddleWare(), function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  //Checks that are in baserouter need to be applied to this route -  BEGIN
  resourceApp.findOne({'$and': [{_id: req.params.resourceId},{delete: {'$ne': true}}]}).exec()
  .then((app)=>{
    if (!app) {
      return Promise.reject(new Error('No application found.'));
    }
    return app;
  })
  .then((app)=>{
      return hooks.run(app.hooks.onPublish)
      .then((resp)=>{
        return [resp,app.hooks.onPublish]
      });
  })
  .then(([resp,hook])=>{
    let val = hook.responsePath.split('.').reduce((obj, i)=>{return obj[i];}, resp.body);
    if (val.match(new RegExp(hook.regexValue))) {
      return res.send({status: 'ok',response: 'Published'});
    } else {
     return Promise.reject(new Error("Response did not match hook value."));
    }
  })
  .catch((err)=>{
    return res.send({status: 'err',response: 'Not published. ' + err.message});
  });
});

// jscs:disable
/**
 * @swagger
 * /applications/{resourceId}/generateKey:
 *   get:
 *     tags:
 *       - Applications
 *     description: Generates a apikey for remote access put operations
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         descripti  on: Id of resource
 *         required: true
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *         $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         $ref: "#/definitions/standardResponseModel"
 *           
 */
// jscs:enable
router.get('/applications/:resourceId/generateKey', aclMiddleWare(), function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  //Checks that are in baserouter need to be applied to this route -  BEGIN
  resourceApp.findOne({'$and': [{_id: req.params.resourceId},{delete: {'$ne': true}}]}).exec(function(err, app) {
    if (err || !app) {
      return res.send({status: 'err',response: 'No application found.'});
    } else {
      var randStr = req.params.resourceId + 'kitkat' + new Date().toISOString();
      randStr = randStr.split('').sort(function(a,b){return Math.random()>.5 ? -1 : 1;}); 
      randStr = randStr.join('').replace(/[^a-zA-Z 0-9]+/g,'').substring(2,26)
      var me = {apiKey: randStr};

      resourceService.updateMeta(req.params.resourceId, {apiKey: randStr})
      .then(()=>{
        return res.send({status:'ok',response:'Key Generated'});
      })
      .catch((err)=>{
        return res.send({status: 'err',response: 'Key not generated',moreErr:err.message});
      });;
    }
  });
});

// jscs:disable
/**
 * @swagger
 * /developer/applications/{resourceId}/element/{elementId}/remote:
 *   put:
 *     tags:
 *       - Applications
 *     description: update element data remotely with apikey
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         description: Id of resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: elementId
 *         description: Id of data element new element structure will post to
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: formData
 *         description: Structure of update element
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             apiKey:
 *               type: string
 *               description: apiKey
 *             data:
 *               type: object
 *               items:
 *                 type: object
 *                 properties:
 *                   __t:
 *                     type: string
 *                     enum: [Html,Image,Text,ElementType...]
 *                   name:
 *                     type: string
 *                     description: new elements nice name
 *                   fieldName:
 *                     type: string
 *                     description: new elements field name
 *                   value:
 *                     type: string
 *                     description: new elements default value
 *               properties:
 *                 __t:
 *                   type: string
 *                   enum: [Html,Image,Text,ElementType...]
 *                 name:
 *                   type: string
 *                   description: new elements nice name
 *                 fieldName:
 *                   type: string
 *                   description: new elements field name
 *                 value:
 *                   type: string
 *                   description: new elements default value
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *         $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         $ref: "#/definitions/standardResponseModel"
 *           
 */
/**
 * @api {put} /v1/developer/applications/:resourceId/element/:elementId/remote 
 * @apiDescription Update an element of the application s heirarchy remotely
 * @apiName UpdateApplicationElement
 * @apiGroup Applications
 * @apiParam {string} resourceId Application unique ID.
 * @apiParam {string} elementId Element unique ID.
 * @apiParam {string} apiKey Key to access update functinality
 * @apiParam {json} data Array of element data or single object of element data.
 * @apiParamExample {json} data:
                 {"_id":"elementid","value":"someValue","fieldName":"someElementfieldname","name":"some element name"}
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.put('/developer/applications/:resourceId/element/:elementId/remote', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  if (typeof req.body.data == 'undefined' || typeof req.body.data.fieldName == 'undefined' || typeof req.body.data.name == 'undefined' || typeof req.body.data.value == 'undefined') {
      return res.send({status: 'err',response: 'Incorrect data Structure'});
  }

  if (typeof req.body.data === 'undefined' || req.body.data.length === 0 || typeof req.body.data.value === 'undefined') {
    return res.send({status: 'err',response: 'No data to update'});
  }


  if (typeof req.body.apiKey === 'undefined' || req.body.apiKey === false || req.body.apiKey === null) {
    return res.send({status: 'err',response: 'No apiKey. Please generate one'});
  }
  //Checks that are in baserouter need to be applied to this route -  BEGIN
  if (typeof req.body.useSchema && (req.body.useSchema == 'appData' || req.body.useSchema == 'blueprints')) {
    resourceService.setSchema(req.body.useSchema);
  }
  if (typeof req.query.useSchema && (req.query.useSchema == 'appData' || req.query.useSchema == 'blueprints')) {
    resourceService.setSchema(req.query.useSchema);
  }

  resourceApp.findOne({'$and': [{_id: req.params.resourceId},{delete: {'$ne': true}}]}).exec(function(err, app) {
    if (err || !app) {
      return res.send({status: 'err',response: 'No application found.'});
    } else if(app.apiKey !== req.body.apiKey) {
      return res.send({status: 'err',response: 'Invalid apiKey'});
    }else {
      resourceService.updateElement(req.params.resourceId, req.body.data, req.params.elementId)
      .then(()=>{
        return res.send({status: 'ok',response: 'Data update remotely.'});
      })
      .catch((err)=>{
        return res.send({status: 'err',response: 'No data found.',moreErr:err.message});
      });
    }
  });
});

var baseResourceApiRouter = require('./baseResourceApiRouter.js')(resourceService, 'applications', router);

module.exports = baseResourceApiRouter;
