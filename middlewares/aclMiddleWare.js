/**
 * Module that returns function for authentication resources to users
 * @module aclMiddleware
 */
module.exports = function(userId, resource, method) {
   // jscs:disable
  /** @function
  * @name anonymouse
  * @public
  * @param {object} req - express request object
  * @param {object} res - express response object
  * @param {object} fn - callback function
  * @description Auths user against resource id for access and action
  * @return {null} 
  *
  */
  // jscs:enable
  return function(req, res, next) {

    //Checked loggedIn
    if (typeof req.user == 'undefined') {
      res.writeHead(401, 'UnAuthorized', {'content-type': 'application/json'});
      res.end(JSON.stringify({status: 'err',response: 'Must be logged in to access this endpoint. User does not exist.'}));
      return;
    }
    var aclMethod = req.method.toLowerCase();
    var aclResource = (typeof req.params.resourceId != 'undefined') ? req.params.resourceId : req.baseUrl + req.route.path;
    var aclUser = req.user._id.toString() + '-' + req.user.local.email;
    if (typeof userId != 'undefined' && userId != null)
      aclUser = userId;
    if (typeof resource != 'undefined' && resource != null)
      aclResource = resource;
    if (typeof method != 'undefined' && method != null)
      aclMethod = method;
    if (false) {
      console.log('acl-user', aclUser);
      console.log('acl-resource', aclResource);
      console.log('acl-method', aclMethod);
      req._acl.userRoles(aclUser, function(err, roles) {
        console.log('acl-userRoles', roles);
      });
      req._acl.allowedPermissions(aclUser, aclResource, function(err, obj) {
        console.log('acl-allowedPerms', obj);
      });
    }
    //Check Is Super User
    req._acl.hasRole(aclUser, 'admin', function(err, hasRole) {
      if (hasRole) {
        return next();
      } else {
        req._acl.isAllowed(aclUser, aclResource, aclMethod, function(err, allowed) {
          if (err) {
            res.writeHead(500, 'Access Error', {'content-type': 'application/json'});
            res.end(JSON.stringify({status: 'err', response: 'Error trying to access resource'}));
            return;
          }
          if (!allowed) {
            res.writeHead(403, 'UnAuthorized', {'content-type': 'application/json'});
            res.end(JSON.stringify({status: 'err', response: 'You are not allowed to access this endpoint.'}));
            return;
          } else {
            next();
          }
        });
      }
    });
  };
};
