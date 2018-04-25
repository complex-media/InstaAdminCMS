import {combineReducers } from 'redux';
import * as AT from '../constants';
import {initialState} from '../constants';

//redux reducers to change state of applications

function networkStatus(state=initialState.networkStatus, action) {
  let newState = Object.assign({},state);
  switch (action.type) {
    case AT.NETWORK_RETRIEVING:
      newState.isFetching = action.isFetching;
      newState.waitingMsg = action.txt;
      return newState;
    default:
      return state;
  }
  return state;
}

function applicationListFilter(state = initialState.route.applications.searchFilter, action) {
    var newState = Object.assign({}, state);
    switch (action.type) {
        case AT.SET_VISIBILITY_FILTER:
          newState.type = action.filter;
          return newState;
        case AT.SET_VISIBILITY_NAMEFILTER:
          newState.searchTxt = action.searchTxt;
          return newState;
        default:
          return state
    }
}

function notificationState(state = initialState.notification, action){
  let newState = Object.assign({},state);
  switch (action.type) {
        case AT.SET_NOTIFICATION_PANEL:
          newState.notificationPanelActive = action.notifcationState;
          return newState;
        case AT.PUSH_NOTIFICATION:
          newState.currentNotificationObject = action.newNotificationObj;
          newState.history.unshift(action.newNotificationObj);
          newState.notificationPanelActive = true;
          return newState;
        default:
          return state
    }
}

function sideBarState(state = initialState.sideBarPanelActive, action){
  let newState = Object.assign({},state);
  switch (action.type) {
      case AT.SET_SIDEBAR_PANEL:
        newState = action.sideBarState;
        return newState;
      default:
        return state
  }
}

function config(state = initialState.sConfig,action){
  return state
}

// combine reducers
const rootReducer = combineReducers({
  searchFilter:applicationListFilter,
  networkStatus,
  notification:notificationState,
  sideBarPanelActive:sideBarState,
  sConfig:config
});

export default rootReducer;