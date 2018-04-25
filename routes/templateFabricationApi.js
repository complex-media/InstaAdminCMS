var resourceTemplate = require('../models/resources/resource-template.js');
var resourceService = require('../services/resourceService.js')(resourceTemplate);
var baseResourceApiRouter = require('./baseResourceApiRouter.js')(resourceService, 'templates');

module.exports = baseResourceApiRouter;
