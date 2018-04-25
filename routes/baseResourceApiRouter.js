var express = require('express');
var bodyParser = require('body-parser');

var aclMiddleWare = require('../middlewares/aclMiddleWare.js');

module.exports = function(resourceService, resourceName, existingRouter) {
  var router;

  if (typeof existingRouter === 'undefined') {
    router = express.Router();
  } else {
    router = existingRouter;
  }

  router.all('/' + resourceName + '/*', function(req, res, next) {
    if (typeof req.body.useSchema && (req.body.useSchema == 'appData' || req.body.useSchema == 'blueprints')) {
      resourceService.setSchema(req.body.useSchema);
    }
    if (typeof req.query.useSchema && (req.query.useSchema == 'appData' || req.query.useSchema == 'blueprints')) {
      resourceService.setSchema(req.query.useSchema);
    }

    next();
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}:
   *   put:
   *     tags:
   *       - Apps Templates Components
   *     description: Update Resource meta data
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         schema:
   *           type: string
   *         enum: [templates,applications,components]
   *       - in: path
   *         name: resourceId
   *         description: Id of resource
   *         required: true
   *         schema:
   *           type: string
   *       - in: body
   *         name: formData
   *         description: updateObject
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             metaData:
   *               type: object
   *               properties:
   *                 title:
   *                   description: Unique title of resource
   *                   type: string
   *                   required: true
   *                 description:
   *                   description: Description of resource
   *                   required: true
   *                   type: string
   *                 state:
   *                   description: Arbitrary numerical state
   *                   required: false
   *                   type: integer
   *                 schemaLock:
   *                   description: Lock status of editting resource structure
   *                   required: false
   *                   type: boolean
   *                 dataLock:
   *                   description: Lock status of editting value of elements
   *                   required: false
   *                   type: boolean
   *                 url:
   *                   description: Location of associated app
   *                   required: false
   *                   type: string
   *                 tags:
   *                   description: Tags for various reasons
   *                   required: false
   *                   type: string
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
   * @api {put} /v1/:resourceName/:resourceId UpdateResource
   * @apiDescription Update an Resource meta data
   * @apiName UpdateResource
   * @apiGroup Generic Resource Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} resourceId Application unique ID.
   * @apiParamExample {json} metaData: {"title":"title","description":"description","state":"statenumber","schemaLock":"boolean"}
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.put('/' + resourceName + '/:resourceId', aclMiddleWare(), function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    resourceService.updateMeta(req.params.resourceId, req.body.metaData)
    .then(()=>{
      res.send({status: 'ok', response: 'App updated.'});
    })
    .catch((err)=>{
      res.send({status: 'err', response: 'Could not update app.','moreErr': err.message})
    })
  });

  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}:
   *   delete:
   *     tags:
   *       - Apps Templates Components
   *     description: Soft delets resource
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         schema:
   *           type: string
   *         enum: [templates,applications,components]
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
   *         $ref: "#/definitions/standardResponseModel"
   *           
   */
  /**
   * @api {delete} /v1/:resourceName/:resourceId DeleteResource
   * @apiDescription Soft delete a resource
   * @apiName DeleteResource
   * @apiGroup Generic Resource Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} resourceId Application unique ID.
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.delete('/' + resourceName + '/:resourceId', aclMiddleWare(), function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    resourceService.delete(req.params.resourceId)
    .then(()=>{
      return res.send({status: 'ok', response: 'App deleted.'});
    })
    .catch((err)=>{
      return res.send({status: 'err', response: 'App was not deleted.'});
    });
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}:
   *   get:
   *     tags:
   *       - Apps Templates Components
   *     description: Get resource 
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
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
   *         $ref: "#/definitions/resourseResponseModel"
   *           
   */
  /**
   * @api {get} /v1/:resourceName/:resourceId GetResource
   * @apiDescription Get resource by id
   * @apiName GetResource
   * @apiGroup Generic Resource Endpoints 
   * @apiParam {string} resourceId Application unique ID.
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiSuccess {String} data  Resource data.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.get('/' + resourceName + '/:resourceId', function(req, res, next) {
    var config = {};
    config.useData = typeof req.query.useData != 'undefined' && req.query.useData == 'true' ? true : false;
    config.useType = typeof req.query.useType != 'undefined' ? req.query.useType : null;

    resourceService.get(req.params.resourceId, config)
    .then((data)=>{
      res.setHeader('Content-Type', 'application/json');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      if (data) {
        if (typeof req.user != 'undefined' && typeof req.user._id != 'undefined') {
          req._acl.userRoles(req.user._id + '-' + req.user.local.email, function(err, roles) {
            if (!err) {
              roles.forEach(function(roleRes) {
                var role = roleRes.replace('-' + req.params.resourceId, '');
                if ('developer|owner|guest|editor'.indexOf(role) !== -1) {
                  data.resourceRole = role;
                }
              });
              res.send({status: 'ok',response: 'Recieved.',data: data});
            }
          });
        } else {
          res.send({status: 'ok',response: 'Recieved.',data: data});
        }
      } else {
        res.send({status: 'err',response: 'No apps found.'});
      }
    });
  });

  router.use(function(req, res, next) {
    if (!req.isAuthenticated()) {
      res.writeHead(401, 'UnAuthorized', {'content-type': 'application/json'});
      return res.end(JSON.stringify({status: 'err',response: 'Not authorized. Please login'}));
    } else {
      res.setHeader('Content-Type', 'application/json');
      next();
    }
  });

  // jscs:disable
  /**
   * @swagger
   * /{resourceName}:
   *   get:
   *     tags:
   *       - Apps Templates Components
   *     description: Get resources 
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
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
   *           
   */
  /**
   * @api {get} /v1/:resourceName GetResourceList
   * @apiDescription Get list of resources
   * @apiName GetResourceList
   * @apiGroup Generic Resource Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   *
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiSuccess {String} data  List of resoruces
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.get('/' + resourceName , aclMiddleWare(), function(req, res, next) {

    resourceService.get(undefined, {})
    .then((data)=>{
      if (data) {
        return res.send({status: 'ok',response: 'Recieved.',data: data});
      } else {
        return res.send({status: 'err',response: 'No apps found.'});
      }
    });
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}:
   *   post:
   *     tags:
   *       - Apps Templates Components
   *     description: Create new resource 
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
   *       - in: body
   *         name: postdata
   *         description: Unique title of resource
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             title:
   *               description: Unique title of resource
   *               type: string
   *               required: true
   *             description:
   *               description: Description of resource
   *               required: true
   *               type: string
   *             url:
   *               description: Url of resource
   *               type: string
   *               required: false
   *             tags:
   *               description: tags
   *               required: false
   *               type: string
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
   * @api {post} /v1/:resourceName CreateResource
   * @apiDescription Create a new resource
   * @apiName CreateResource
   * @apiGroup Generic Resource Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} title Resource title
   * @apiParam {string} description Resource description
   *
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.post('/' + resourceName, aclMiddleWare(), function(req, res, next) {
    if (typeof req.body.title == 'undefined' || typeof req.body.description == 'undefined') {
      res.send({status: 'err',response: 'No description or title for the app'});
    } else {
      var data = req.body;
      data.createdBy = req.user._id;
      resourceService.create(data)
      .then((resource)=>{
        //ADDS BASE ROLES FOR RESOURCE AND ASSINGES CREATER AS OWNER
        var aclService = require('../services/resourceAclService.js');
        aclService.addResourceRole(resource._id.toString(), req._acl, function(err) {
          if (err) {
            res.send({status: 'err',response: 'App created but there are permissions errors.'});
          }

          req._acl.addUserRoles(req.user._id + '-' + req.user.local.email, 'owner-' +  resource._id, function(err) {
            if (!err) {
              res.send({status: 'ok',response: 'App Created.'});
            } else {
              return res.send({status: 'err',response: 'Owner could not be added.'});
            }
          });

        });
      })
      .catch((err)=>{
        return res.send({status: 'err',response: err.message});
      });
    }
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}/element/{elementId}:
   *   delete:
   *     tags:
   *       - Apps Templates Components
   *     description: Delete element from resource data structure
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
   *       - in: path
   *         name: resourceId
   *         description: Id of resource
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: elementId
   *         description: Id of data element
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
   * @api {delete} /v1/:resourceName/:resourceId/element/:elementId DeleteResourceElement
   * @apiDescription Delete an element of the resource heirarchy
   * @apiName DeleteResourceElement
   * @apiGroup Generic Resource Element Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} resourceId Application unique ID.
   * @apiParam {string} elementId Element unique ID.
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.delete('/' + resourceName + '/:resourceId/element/:elementId', aclMiddleWare(), function(req, res, next) {
    resourceService.removeElement(req.params.resourceId, req.params.elementId)
    .then(()=>{
      res.send({status: 'ok', response: 'Structure Removed.'});
    })
    .catch((err)=>{
      res.send({status: 'err', response: 'Structure not removed.',moreErr:err.message});
    })
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}/element/{elementId}:
   *   post:
   *     tags:
   *       - Apps Templates Components
   *     description: Add a new element to data structure
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
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
   *         description: Structure of new element
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             structure:
   *               type: object
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
   * @api {post} /v1/:resourceName/:resourceId/element/:elementId CreateResourceElement
   * @apiDescription Create an element of the resource heirarchy
   * @apiName CreateResourceElement
   * @apiGroup Generic Resource Element Endpoints
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} resourceId Application unique ID.
   * @apiParam {string} elementId Element unique ID that new element will append to .
   * @apiParam {array} structure Array of element data or single object of element data.
   * @apiParamExample {json} metaData:
                   {"value":"someValue","fieldName":"someElementfieldname","name":"some element name","__t":"ElementType"}
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.post('/' + resourceName + '/:resourceId/element/:elementId', aclMiddleWare(), function(req, res, next) {
    if (typeof req.body.structure == 'undefined') {
      return res.send({status: 'err',response: 'No structure recieved'});
    }

    var structure = {};
    if (Array.isArray(req.body.structure)) {
      structure = req.body.structure;
    } else {
      structure = [req.body.structure];
    }
    // test add element test add componenet
    resourceService.addElement(structure, req.params.resourceId, req.params.elementId)
    .then(()=>{
      return res.send({status: 'ok', response: 'Structure Added.'});
    })
    .catch((err)=>{
      console.log(err);
      return res.send({status: 'err', response: 'Structure not added.',moreErr:err.message,err:err});
    });
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}/element/{elementId}:
   *   put:
   *     tags:
   *       - Apps Templates Components
   *     description: update element data
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
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
   *             data:
   *               type: object
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
   * @api {put} /v1/:resourceName/:resourceId/element/:elementId UpdateResource
   * @apiDescription Update an element of the resource heirarchy
   * @apiName UpdateResourceElement
   * @apiGroup Generic Resource Element Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} resourceId Application unique ID.
   * @apiParam {string} elementId Element unique ID.
   * @apiParam {array} data Array of element data or single object of element data.
   * @apiParamExample {json} metaData:
                   {"_id":"elementid","value":"someValue","fieldName":"someElementfieldname","name":"some element name"}
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.put('/' + resourceName + '/:resourceId/element/:elementId', aclMiddleWare(), function(req, res, next) {
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
        return res.send({status: 'err',response: 'No data to dupdate'});
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
        res.send({status: 'ok',response: 'Element updated'});
      })
      .catch((err)=>{
        res.send({status: 'err',response: 'Element not updated',moreErr:err.message});
      })
    }
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}/element/{elementId}/copy:
   *   post:
   *     tags:
   *       - Apps Templates Components
   *     description: update element data
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
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
   *       - in: query
   *         name: dupCompId
   *         description: element to duplicate and add to structure
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
   * @api {copy} /v1/:resourceName/:resourceId/element/:elementId CopyResourceElement
   * @apiDescription Copy an element to child of another element component
   * @apiName CopyResourceElement
   * @apiGroup Generic Resource Element Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} resourceId Application unique ID.
   * @apiParam {string} elementId Element unique ID that will be copied to.
   * @apiParam {string} dupCompId Id of element to copy
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.post('/' + resourceName + '/:resourceId/element/:elementId/copy', aclMiddleWare(), function(req, res, next) {

    if (typeof req.body.dupCompId == 'undefined') {
      return res.send({status: 'err',response: 'No duplicating component ID recieved'});
    }

    if (req.params.resourceId == req.query.dupCompId) {
      return res.send({status: 'err',response: 'Cannot dupliate whole app in this method.'});
    }

    if (req.params.elementId == req.body.dupCompId) {
      return res.send({status: 'err',response: 'Cannot duplicate element under itself.'});
    }

    // test add element test add componenet
    resourceService.copyElementTo(req.params.resourceId, req.body.dupCompId, req.params.elementId)
    .then(()=>{
      res.send({status: 'ok',response: 'Element duplicated'});
    })
    .catch((err)=>{
      res.send({status: 'err',response: 'Cannot duplicate node.',moreErr:err.message});
    })
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}/list/{elementId}:
   *   delete:
   *     tags:
   *       - Apps Templates Components
   *     description: Delete list element, used as a way to remove items based on prototypes
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
   *       - in: path
   *         name: resourceId
   *         description: Id of resource
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: elementId
   *         description: Id of resource
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: listIndex
   *         description: index of list item
   *         required: true
   *         schema:
   *           type: integer
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
   * @api {delete} /v1/:resourceName/:resourceId/element/:elementId DeleteResourceElement
   * @apiDescription Delete an element of the resource heirarchy
   * @apiName DeleteResourceElement
   * @apiGroup Generic Resource Element Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} resourceId Application unique ID.
   * @apiParam {string} elementId Element unique ID.
   * @apiParam {number} listIndex Index of the element that needs to be delete from parent element
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.delete('/' + resourceName + '/:resourceId/list/:elementId', aclMiddleWare(null, null, 'postlist'), function(req, res, next) {

    if (typeof req.query.listIndex == 'undefined') {
      return res.send({status: 'err',response: 'No item chosen.'});
    }

    resourceService.removeFromList(req.params.resourceId, req.params.elementId, req.query.listIndex)
    .then(()=>{
      res.send({status: 'ok',response: 'Removed list element.'});
    })
    .catch((err)=>{
      res.send({status: 'err',response: 'Error removing list element.',moreMsg:err.message});
    })
  });
  // jscs:disable
  /**
   * @swagger
   * /{resourceName}/{resourceId}/list/{elementId}:
   *   post:
   *     tags:
   *       - Apps Templates Components
   *     description: Copy list element, used to duplicate an item in a list
   *     parameters:
   *       - in: path
   *         name: resourceName
   *         description: Name of resource type
   *         required: true
   *         type: string
   *         enum: [templates,applications,components]
   *       - in: path
   *         name: resourceId
   *         description: Id of resource
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: elementId
   *         description: Id of list element
   *         required: true
   *         schema:
   *           type: string
   *       - in: body
   *         name: listIndex
   *         description: index of list item
   *         required: true
   *         schema:
   *           type: integer
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
   * @api {copy} /v1/:resourceName/:resourceId/element/:elementId AppendResourceElement
   * @apiDescription Duplicate a list element and append it to that list
   * @apiName AppendResourceElement
   * @apiGroup Generic Resource Element Endpoints 
   * @apiParam {string} resourceName Resource type {application|template|component}
   * @apiParam {string} resourceId Application unique ID.
   * @apiParam {string} elementId Element unique ID that will be copied to.
   * @apiParam {string} listIndex Index of child component to duplicate and append
   * @apiSuccess {String} status Ok or Err.
   * @apiSuccess {String} response  Reason for status.
   * @apiError {String} status Err.
   * @apiError {String} response  Reason for status.
   */
  // jscs:enable
  router.post('/' + resourceName + '/:resourceId/list/:elementId', aclMiddleWare(null, null, 'postlist'), function(req, res, next) {

    if (typeof req.body.listIndex == 'undefined') {
      return res.send({status: 'err',response: 'No item chosen.'});
    }

    resourceService.addToList(req.params.resourceId, req.params.elementId, req.body.listIndex)
    .then(()=>{
      res.send({status: 'ok',response: 'Added list element.'});
    })
    .catch((err)=>{
      res.send({status: 'err',response: 'Error adding list element.',moreMsg:err.message});
    });
  });
  return router;
};
