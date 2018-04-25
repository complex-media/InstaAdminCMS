import apiService from '../apiService';
import * as AT from '../constants';


let responseMiddleWare = (resp,dispatch,typeOverride)=>{
  let msgObj = {
    msg:resp.response,
    type:resp.status
  }
  if(typeOverride && msgObj.type == 'ok'){
    msgObj.type = typeOverride;
  }

  if(typeOverride != 'none') {
    dispatch(pushNotification(msgObj))
    dispatch(setNotifcationActive(true));
    setTimeout(() => {
      dispatch(setNotifcationActive(false))
    }, 5000)
  }
  return resp;
}
//redux actioncreator 
export const retrieveData = (isFetching,txt)=>{
    return {
        type:AT.NETWORK_RETRIEVING,
        isFetching,
        txt
    }
}

// action creator
export const setVisibiltyFilter = (filter)=>{
  return {type:AT.SET_VISIBILITY_FILTER, filter};
}

export const setVisibilitNameFilter = (searchTxt)=>{
  return {type:AT.SET_VISIBILITY_NAMEFILTER,searchTxt}
}

export const retrieveApplications = (id)=>{
    return {
        type:AT.RETRIEVE_APPLICATION,
        id
    }
}

export const recieveApplications = (applications)=>{
    return {
        type:AT.RECIEVED_APPLICATION,
        applications
    }
}

export const pushNotification = (newNotificationObj)=>{
  return{
    type:AT.PUSH_NOTIFICATION,
    newNotificationObj
  }
}

export const setNotifcationActive = (notifcationState)=>{
  return{
    type:AT.SET_NOTIFICATION_PANEL,
    notifcationState
  }
}

export const setSideBarActive = (sideBarState)=>{
  return{
    type:AT.SET_SIDEBAR_PANEL,
    sideBarState
  }
}

export const publishApplication = (id=null, cb)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.publish(id).then((resp)=>{
      dispatch(retrieveData(false));

      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const updateResource = (id,resourceType,nodeId,form,cb)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.updateElements(id,resourceType,nodeId,form).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const updateApplicationMeta = (id,resourceType,form)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.updateResourceMeta(id,form,resourceType).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const fetchResource = (id=null,resourceType, cb)=>{
  return function(dispatch){
    dispatch(retrieveData(true,'...retrieving'));
    return apiService.getResource(id,resourceType).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const fetchResources = (resourceType, cb)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.getResources(resourceType).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch,'none');
    });
  }
}

export const createResource = (post ,resourceType, cb)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.createResource(post,resourceType).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const duplicateElement = (id,resourceType,dupId,targetId)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.duplicateElement(id,resourceType,dupId,targetId).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const fetchApplicationProto = (id=null, resourceType)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.getResourceProto(id,resourceType).then((resp)=>{
      dispatch(retrieveData(false));
     return responseMiddleWare(resp,dispatch);
    });
  }
}

export const fetchFormElements = (cb)=>{
  return function(dispatch){
    dispatch(retrieveData(true,'...retrieving'));
    return apiService.getFormElements().then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const fetchLibraryComponents = (cb)=>{
  return function(dispatch){
    dispatch(retrieveData(true,'...retrieving'));
    return apiService.getLibraryComponents().then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const deleteElement = (id,resourceType,elementId)=>{
  return function(dispatch){
    dispatch(retrieveData(true,'...retrieving'));
    return apiService.deleteElement(id,resourceType,elementId).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}



export const updateElement = (id,resourceType,elementId,form)=>{
  return function(dispatch){
    dispatch(retrieveData(true,'...retrieving'));
    return apiService.updateElement(id,resourceType,elementId,form).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const addElements = (id,resourceType,elementId,structure)=>{
  return function(dispatch){
    dispatch(retrieveData(true,'...retrieving'));
    return apiService.addElements(id,resourceType,elementId,structure).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const uploadFile = (id,eId,file,cb) =>{
  return function(dispatch){
    dispatch(retrieveData(true,'...uploading'));
    return apiService.uploadFile(id,eId,file).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const addToList = (id,resourceType,eId,index,cb) =>{
  return function(dispatch){
    dispatch(retrieveData(true,'...uploading'));
    return apiService.addToList(id,resourceType,eId,index).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const removeFromList = (id,resourceType,eId,index,cb) =>{
  return function(dispatch){
    dispatch(retrieveData(true,'...uploading'));
    return apiService.removeFromList(id,resourceType,eId,index).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const getTemplates = (cb)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.getTemplates().then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const getAppActivity = ()=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.getAppActivity().then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch,'none');
    });
  }
}

export const getRoles = ()=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.getRoles().then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const updateRoles = (id,put)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.updateRoles(id,put).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const deleteUser = (id)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.deleteUser(id).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const reIssueUserCreds = (handle)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.reIssueUserCreds(handle).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const invite = (email,role)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.invite(email,role).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

//Profile
export const getProfile = ()=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.getProfile().then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const updateProfileEmail = (email)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.updateProfileEmail(email).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const updateProfilePassword = (pw)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.updateProfilePassword(pw).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const deleteOAuth = (oauthtype)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.deleteOAuth(oauthtype).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const getHelpDescriptions = ()=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.getHelpDescriptions().then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch,'none');
    });
  }
}

export const updateHook = (hooks,id)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.updateHook(hooks,id).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const duplicateResource = (post)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.duplicateResource(post).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const inviteResourceUser = (...params)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.inviteResourceUser(...params).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
     });
  }
}

export const updateResourceUser = (...params)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.updateResourceUser(...params).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const addResourceUser = (...params)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.addResourceUser(...params).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}

export const deleteResourceUser = (...params)=>{
  return function(dispatch){
    dispatch(retrieveData(true));
    return apiService.deleteResourceUser(...params).then((resp)=>{
      dispatch(retrieveData(false));
      return responseMiddleWare(resp,dispatch);
    });
  }
}
