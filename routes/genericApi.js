var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var components = require('../services/componentService.js');
var templates = require('../services/templateService.js');
var elementForms = require('../services/elementFormService.js');
var aclMiddleWare = require('../middlewares/aclMiddleWare.js');
var resourceApp = require('../models/resources/resource-app.js');
var moment = require('moment');
// jscs:disable
/**
 * @swagger
 * /getFormElements:
 *   get:
 *     tags:
 *       - Elements
 *     description: Request element form default data and type
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *        $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         description: Dictionary of element's default data and path to front end templates.
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [ok,err]
 *             response:
 *               type: string
 *               description: Reason for type of response
 *             data:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties: 
 *                   formPath:
 *                     type: string
 *                   default:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       fieldName:
 *                         type: string
 *           
 */

/**
 * @api {get} /getFormElements GetElementData
 * @apiDescription Request element form default data and type
 * @apiName GetElementData
 * @apiGroup Misc
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiSuccess {String} data  Element default data.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.get('/getFormElements', aclMiddleWare(), (req, res, next)=>{
  elementForms.get({})
  .then((data)=>{
    res.setHeader('Content-Type', 'application/json');
    res.send({status: 'ok',response: 'Recieved.',data: data});
  })
  .catch(function(err){
    res.setHeader('Content-Type', 'application/json');
    res.send({status: 'err',response: 'Request failed'});
  });
});
// jscs:disable
/**
 * @swagger
 * /getLibraryComponents:
 *   get:
 *     tags:
 *       - Elements
 *     description: Get list of published Components schemas
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *        $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         description: Dictionary of componenet shemas
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [ok,err]
 *             response:
 *               type: string
 *               description: Reason for type of response
 *             data:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   $ref: "#/definitions/elementModel"
 *           
 */
/**
 * @api {get} /getLibraryComponents GetComponentsList
 * @apiDescription Request list of published components
 * @apiName GetComponentsList
 * @apiGroup Components-Templates
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiSuccess {String} data  Component structure list.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.get('/getLibraryComponents', aclMiddleWare(), (req, res, next)=>{
  components.get({})
  .then(data => { 
    res.setHeader('Content-Type', 'application/json');
    res.send({status: 'ok',response: 'Recieved.',data: data});
  })
  .catch(function(err){
    res.setHeader('Content-Type', 'application/json');
    res.send({status: 'err',response: 'Request failed'});
  });
});
// jscs:disable
/**
 * @swagger
 * /getTemplates:
 *   get:
 *     tags:
 *       - Elements
 *     description: Get list of published Template schemas
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *        $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         description: Dictionary of template schemas
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [ok,err]
 *             response:
 *               type: string
 *               description: Reason for type of response
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: 
 *                     type: string
 *                   title:
 *                     type: string
 *                   __t:
 *                     enum: ["Template"]
 *                     type: string
 *           
 */
/**
 * @api {get} /getTemplates GetTemplateList
 * @apiDescription Request list of templates
 * @apiName GetTemplateList
 * @apiGroup Components-Templates
 * @apiSuccess {String} status Ok or Err.
 * @apiSuccess {String} response  Reason for status.
 * @apiSuccess {String} data  Template list.
 * @apiError {String} status Err.
 * @apiError {String} response  Reason for status.
 */
// jscs:enable
router.get('/getTemplates', aclMiddleWare(), (req, res, next)=>{
  templates.get({})
  .then(data =>{ 
    res.setHeader('Content-Type', 'application/json');
    res.send({status: 'ok',response: 'Recieved.',data: data});
  })
  .catch(function(err){
    res.setHeader('Content-Type', 'application/json');
    res.send({status: 'err',response: 'Request failed'});
  });
});
// jscs:disable
/**
 * @swagger
 * /getActivity:
 *   get:
 *     tags:
 *       - Elements
 *     description: Get list recent instaapps
 *     produces:
 *       - application/json
 *     responses:
 *       401:
 *        $ref: "#/definitions/unAuthorizedModel"
 *       200:
 *         description: Dictionary of template schemas
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [ok,err]
 *             response:
 *               type: string
 *               description: Reason for type of response
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: 
 *                     type: string
 *                   title:
 *                     type: string
 *                   __t:
 *                     enum: ["App"]
 *                     type: string
 *                   description: 
 *                     type: string
 *                   createdAt: 
 *                     type: dateTime
 *                   state: 
 *                     enum: [0 , 1 ,2 ]
 *                     type: string
 *                   deleted:
 *                     type: boolean
 *                   activity: 
 *                     enum: ['new' , 'development' ,'idle' ]
 *                     type: string
 *           
 */
// jscs:enable
router.get('/getActivity', (req, res, next)=>{
  resourceApp.find({'$or': [
    {'$and': [{state: 1},{createdAt: {'$gt': moment().subtract(15, 'days').format('YYYY-MM-DDTHH:mm:ss')}}]},
    {'$and': [{state: 0},{createdAt: {'$lte': moment().subtract(15, 'days').format('YYYY-MM-DDTHH:mm:ss')}}]},
    {'$and': [{state: 0},{createdAt: {'$gt': moment().subtract(15, 'days').format('YYYY-MM-DDTHH:mm:ss')}}]}
    ]})
  .select({"appData": 0}).sort('createdAt -1').lean().exec()
  .then((apps)=>{
    if (apps.length > 0) {
      apps = apps.map((app)=>{
        if (app.state == 1 && moment().subtract(15, 'days') < app.createdAt.valueOf()) {
          app.activity = 'new';
        } else if (app.state === 0 && moment().subtract(15, 'days') < app.createdAt.valueOf()) {
          app.activity = 'development';
        } else if (app.state === 0 && moment().subtract(15, 'days') > app.createdAt.valueOf()) {
          app.activity = 'idle';
        } else {
        }
        return app;
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send({status: 'ok',response: 'Activity.',data: apps});
  })
  .catch(function(err){
    res.setHeader('Content-Type', 'application/json');
    res.send({status: 'err',response: 'Request failed'});
  });
});

module.exports = router;
