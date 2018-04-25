/**
 * Used to create destroy auth and broadcast websocket and websocket data.
 * @module websocketService
 */

var debug = require('debug')('instaadmin:webSocket');
var webSocket = require('ws');
var Resource = require('../models/resources/resource.js');
var url = require('url');

var wsServer;
var wsEvents = {};
var wsTokens = [];
// jscs:disable
/** 
* @function
* @name _subscribe
* @private
* @todo add more events?
* @param {object} ws - websocket object
* @param {string} appId - application Id of events to subscribe to
* @description Subscribes ws to specific applicaiton events
* @return {null} 
*
*/
// jscs:enable
var _subscribe = function(ws, appId) {
  Resource.findOne({_id: appId}).lean().exec(function(err, apps) {
    if (!err && apps._id == appId) {
      if (!wsEvents[appId]) {
        wsEvents[appId] = {updated: {}};
      }

      wsEvents[appId].updated[ws._guid] = ws;
    } else {
      debug('AppId does not exist. Cannot subscribe.');
    }

  });
};
// jscs:disable
/** @function
* @name _unSubscribe
* @private
* @param {object} ws - websocket object
* @param {string} appId - application Id of events to subscribe to
* @description Unsubscribes ws from specific applicaiton events
* @return {null} 
*
*/
// jscs:enable
var _unSubscribe = function(ws, appId) {
  if (wsEvents[appId]) {
    for (var eventType in wsEvents[appId]) {
      delete wsEvents[appId][eventType][ws._guid];
    }
  }
};
// jscs:disable
/** @function
* @name _unSubscribeAll
* @private
* @param {object} ws - websocket object
* @description Unsubscribes websocket from all events
* @return {null} 
*
*/
// jscs:enable
var _unSubscribeAll = function(ws) {
  for (var app in wsEvents) {
    for (var eventType in wsEvents[app]) {
      delete wsEvents[app][eventType][ws._guid];
    }
  }
  debug('unsubscribing', ws._guid);
};

var _parseMsg = function(msg) {
  return JSON.parse(msg);
};
// jscs:disable
 /** @function
  * @name _generateGUID
  * @private
  * @description Creates a Global token refering to websocket
  * @return {string} gui token
  *
  */
  // jscs:enable
var _generateGUID = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4();
};
// jscs:disable
/** @function
* @name _removeToken
* @private
* @param {string} hash - ws token string
* @description Deletes websocket token identifier from system
* @return {null} 
*
*/
// jscs:enable
var _removeToken = function(hash) {
  for (var i = 0; i < wsTokens.length; i++) {
    if (wsTokens[i] == hash) {
      debug('Removed WS Token-', hash);
      wsTokens.splice(i, 1);
    }
  }
};

module.exports = {
  // jscs:disable
  /** @function
  * @name create
  * @access public
  * @description Binds a websocket instance to the current express app server, binds close , open and messaging callbacks
  * @param {Object} server - express server object
  * @return {null}
  *
  */
  // jscs:enable
  create: function(server) {
    return;
    if (!wsServer) {
      wsServer = new webSocket.Server({
        server: server,
        path: "/ws",
        verifyClient: function(info) {

          var location = url.parse(info.req.url, true);
          if (wsTokens.indexOf(location.query.token) > -1) {
            return true;
          } else {
            return false;
          }
        }
      });

      wsServer.on('connection', function connection(ws, and) {
        var location = url.parse(ws.upgradeReq.url, true);
        ws._guid = _generateGUID();
        ws._token = location.query.token;
        debug('New ws connection -'+ws._guid );
        ws.on('message', function(msg) {
          msg = _parseMsg(msg);
          if (msg.action == 'subscribe') {
            debug('subscrebe to ', msg.data);
            _subscribe(this, msg.data);
          } else if (msg.action == 'unsubscribe') {
            debug('unsubscribed to ', msg.data);
            _unSubscribe(this, msg.data);
          }

        });

        ws.on('close', function close() {
          debug('WS Closed');
          _removeToken(this._token);
          _unSubscribeAll(this);
        });

      });
    }
  },
  // jscs:disable
  /** 
  * @function
  * @name createToken
  * @access public
  * @todo rewrite this for a better token authentication
  * @description Creates a websocket token for authentication
  * @return {string} websocket global user id
  *
  */
  // jscs:enable
  createToken: function() {
    return null;
    var tempGuid = _generateGUID();
    wsTokens.push(tempGuid);
    return tempGuid;
  },
  // jscs:disable
  /** @function
  * @name broadcast
  * @access public
  * @param {string} evenType - type of action that entity has subscribed to
  * @param {string} appId - the application id entity has subscribed to
  * @param {string} data - data to be sent to websocket entity
  * @description Sends data to entity based on if they are subscribed to an event type and or app id
  * @return {null} 
  *
  */
  // jscs:enable
  broadcast: function(eventType, appId, data) {
    return null;
    if (eventType == 'updated') {
      if (wsEvents[appId] && wsEvents[appId][eventType]) {
        for (var wsGuid in wsEvents[appId][eventType]) {
          debug('Broadcasting');
          wsEvents[appId][eventType][wsGuid].send(JSON.stringify({eventType: eventType, data: data}));
        }
      }
    }
    debug(wsEvents);
    debug(wsTokens);
  }
};
