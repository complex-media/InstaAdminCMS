//initial state
export const initialState = {
    networkStatus:{
      isFetching:false,
      waitingMsg:'',
    },
    route:{
      builder:{
        appId:null
      },
      editor:{
        appId:null
      },
      applications:{
        searchFilter: {type:'SHOW_ALL',searchTxt:''}
      }
    },
    notification:{
      notificationPanelActive:true,
      history:[
        {msg:'Welcome',type:'info'}
      ],
      currentNotificationObject:{
        msg:'Welcome!',
        type:'ok'
      }
    },
    sideBarPanelActive:true,
    sConfig:InstaAdminConfig
};

//action const
//filterActions
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
export const SET_VISIBILITY_NAMEFILTER = 'SET_VISIBILITY_NAMEFILTER'

//network action
export const NETWORK_RETRIEVING = 'NETWORK_RETRIEVING';
export const NETWORK_MESSAGE = 'NETWORK_MESSAGE';

//notificaiton action
export const SET_NOTIFICATION_PANEL = 'SET_NOTIFICATION_PANEL';
export const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION';
export const SET_SIDEBAR_PANEL = 'SET_SIDEBAR_PANEL';
