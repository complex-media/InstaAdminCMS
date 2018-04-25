/**
 * Used to creates roles and the permissions for a new resource
 * @module resourceAclService
 */

module.exports = {
  // jscs:disable
  /** @function
  * @public
  * @name addResourceRole
  * @param {string} resourceId - appid
  * @param {object} aclObj - aclmodule object
  * @param {object} fn - callbakc function
  * @description Creates roles and the permissions for a new resource
  * @return {null}
  *
  */
  // jscs:enable
  addResourceRole: function(resourceId, aclObj, fn) {
    var permissionsData = [
      {
        roles: ['owner-' + resourceId],
        allows: [
          {resources: resourceId, permissions: '*'}
        ]
      },
      {
        roles: ['developer-' + resourceId],
        allows: [
          {resources: resourceId, permissions: ['post','get','put','delete','upload','copy','postlist','options','publish','generateKey']}
       ]
      },
      {
        roles: ['editor-' + resourceId],
        allows: [
          {resources: resourceId, permissions: ['get','put','upload','postlist','options','publish']}
        ]
      },
      {
        roles: ['guest-' + resourceId],
        allows: [
          {resources: resourceId, permissions: ['get']}
        ]
      }
    ];

    aclObj.allow(permissionsData, fn);
  }
};
