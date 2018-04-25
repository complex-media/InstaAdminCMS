var resourceComponent = require('../models/resources/resource-component.js');
var resourceService = require('../services/resourceService.js')(resourceComponent);
var baseResourceApiRouter = require('./baseResourceApiRouter.js')(resourceService, 'components');

module.exports = baseResourceApiRouter;
