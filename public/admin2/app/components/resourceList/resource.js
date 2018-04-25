import React from 'react';
import {connect } from 'react-redux';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import {Button,IconButton} from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import DropDown from 'react-toolbox/lib/input';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import style from './resources.scss';


import FontAwesome from 'react-fontawesome';
import { BrowserRouter as Router, Route, Link as RouterLink} from 'react-router-dom';
import NewResourceDialog from '../dialogs/NewResourceDialog';
import HookDialog from '../dialogs/HookDialog';
import PermissionsDialog from '../dialogs/PermissionsDialog';
import DuplicateDialog from '../dialogs/DuplicateDialog';
import SettingsDialog from '../dialogs/SettingsDialog'

import Header from '../header';

import { 
  setVisibiltyFilter, 
  setVisibilitNameFilter,
  fetchResources, 
  getTemplates, 
  createResource, 
  duplicateResource, 
  updateHook, 
  inviteResourceUser, 
  addResourceUser, 
  updateResourceUser, 
  deleteResourceUser 
} from '../../actions'

//helper funtionsasdf
  
const getVisibleResources = (apps, searchFilter) => {
  switch (searchFilter.type) {
    case 'SHOW_ACTIVE':
      apps = apps.filter(t => t.state===1)
      break;
    case 'SHOW_DEVELOPMENT':
      apps = apps.filter(t => t.state===0)
      break;
  }
  return apps.filter(t => t.title.toLowerCase().indexOf(searchFilter.searchTxt.toLowerCase()) !== -1);
}

const mapStateToProps = (state) => {
  return {
    searchFilter:state.searchFilter,
    sConfig:state.sConfig
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleChangeType: (value) =>{
      return dispatch(setVisibiltyFilter(value));   
    },
    handleChangeName: (value) =>{
      return dispatch(setVisibilitNameFilter(value));
    },
    fetchResources: (resourceType) => {
     return dispatch(fetchResources(resourceType.toLowerCase()+'s'));
    },
    getTemplates: ()=>{
      return dispatch(getTemplates());
    },
    createResource: (post,resourceType)=>{
     return  dispatch(createResource(post,resourceType.toLowerCase()+'s'));
    },
    duplicateResource:(post)=>(dispatch(duplicateResource(post))),
    updateHook:(hooks,id)=>(dispatch(updateHook(hooks,id))),
    inviteResourceUser:(email,role,appId)=>(dispatch(inviteResourceUser(email,role,appId))),
    updateResourceUser:(appId,handle,originalRole,role,userId)=>(dispatch(updateResourceUser(appId,handle,originalRole,role,userId))),
    addResourceUser:(title,appId,handle,userId,role)=>(dispatch(addResourceUser(title,appId,handle,userId,role))),
    deleteResourceUser:(id,userid,role)=>(dispatch(deleteResourceUser(id,userid,role)))
  }
}

const DialogType = (props) => {
  switch (props.dialogType) {
    case 'settings':
      return (<SettingsDialog {...props}/>);
      break;
    case 'hooks':
      return (<HookDialog {...props}/>);
      break;
    case 'permissions':
      return (<PermissionsDialog {...props}/>);
      break;
    case 'duplicate':
      return (<DuplicateDialog {...props}/>);
      break;
    case 'newresource':
      return (<NewResourceDialog {...props}/>);
      break;
    default:
      return (null);
      break
  }
}

class Resources extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          typefilter:[
            {value:'SHOW_ALL',label:'All'},
            {value:'SHOW_ACTIVE',label:'Active'},
            {value:'SHOW_DEVELOPMENT',label:'Development'}
          ],
          dialogActive:false,
          dialogType:'none',
          dialogApp:{},
          dialogMsg:'',
          resources:[
            {_id:'123abc',title:"Resource Stub",state:0}
          ]
        }

        this.dialogHandles = {
          handleSaveHook:(val)=>{this.handleSaveHook(val,this.state.dialogApp._id)},
          handleInviteUser:(...parms)=>{this.handleInviteUser(...parms)},
          handleAddNewResourceUser:(...parms)=>{return this.handleAddNewResourceUser(...parms)},
          handleUpdateAppUserRole:(...parms)=>{return this.handleUpdateAppUserRole(...parms)},
          handleDeleteResourceUser:(...parms)=>{return this.handleDeleteResourceUser(...parms)},
          handleDuplicate:(val)=>{this.handleDuplicate(val)},
          handleDeleteResource:(...args)=>{this.handleDeleteResource()},
          handleResourceCreate:(...args)=>{this.handleResourceCreate(...args)},
          handleUpdateSettingsCallback:(...args)=>{this.handleUpdateSettingsCallback(...args)},
          getTemplates:this.props.getTemplates
        }
    }

    componentDidMount(){
      this.props.fetchResources(this.props.resourceType)
      .then((resp)=>{
        this.setState({resources:resp.data})
      });
    }

    closeDialog(){
        this.setState({dialogActive: false});
    }//uhoh need to bind this or else this is null

    openDialog = (type,appId)=>{       
      if(type=='settings') {
        this.setState({dialogType:type});
      } else {
        this.setState({dialogType:'none'});
      }
      this.setState({dialogAppId:appId});
      this.setState({dialogActive: true});
    }//arrow function has no created this

    handleResourceCreate(val){
      this.props.createResource(val,this.props.resourceType)
      .then((resp)=>{
        if(resp.status == 'ok') {
          this.props.fetchResources(this.props.resourceType)
          .then((resp)=>{
            this.setState({resources:resp.data})
            this.setState({dialogActive:false,dialogMsg:''});
          });
        } else {
          this.setState({dialogMsg:resp.response});
        }
      });
    }

    handleUpdateSettingsCallback(){
      this.props.fetchResources(this.props.resourceType)
      .then((resp)=>{
        this.setState({resources:resp.data})
        this.setState({dialogActive:false});
      });
    }

    handleSaveHook(hooks,id){
      this.props.updateHook(hooks,id)
      .then((resp)=>{
        this.setState({dialogActive:false});
      });
    }

    handleDuplicate(post){
      this.props.duplicateResource(post)
      .then((resp)=>{
        this.props.fetchResources(this.props.resourceType)
        .then((resp)=>{
          this.setState({resources:resp.data,dialogActive:false});
        });
      })
    }

    handleInviteUser(inviteEmail,inviteRole,appId){
      this.props.inviteResourceUser(inviteEmail,inviteRole,appId)
      .then((resp)=>{
        this.setState({dialogActive:false});
      })

    }

    handleAddNewResourceUser(title,user,role,appId){
      return this.props.addResourceUser(title,appId,user.local.email,user._id,role)
      .then((resp)=>{
        if(resp.status == 'ok') {
          this.setState({dialogMsg:'New user added to resource'});
        } else {
          this.setState({dialogMsg:resp.response});
        }
        return resp;
      });
    }

    handleUpdateAppUserRole(appUser,appId){
      return this.props.updateResourceUser(appId,appUser.handle,appUser.originalRole,appUser.role,appUser._id)
      .then((resp)=>{
        if(resp.status == 'ok') {
          this.setState({dialogMsg:'User role updated for application.'});
        } else {
          this.setState({dialogMsg:resp.response});
        }

        return resp
      })
    }

    handleDeleteResourceUser(userid,role){
      return this.props.deleteResourceUser(this.state.dialogApp._id,userid,role)
      .then((resp)=>{
        if(resp.status == 'ok') {
          this.setState({dialogMsg:'User deleted from application.'});
        } else {
          this.setState({dialogMsg:resp.response});
        }

        return resp
      });
    }

    handleDeleteResource(){
      returnthis.props.fetchResources(this.props.resourceType)
      .then((resp)=>{
        this.setState({resources:resp.data,dialogActive:false});
      });
    }

    render() {
        let resourcesItems = getVisibleResources(this.state.resources, this.props.searchFilter).map((app,i)=>{
          return(
            <div key={app._id} style={{backgroundColor:i%2?'rgb(245, 245, 245)':'rgb(255, 255, 255)'}}>
            <ListItem  caption={this.props.resourceType == 'Application'?app.title + ' ['+app.userRole+' access]':''} legend={app.description} leftIcon={<FontAwesome className='overwride-ft-rx' style={{color:app.state==0?'rgba(255, 100, 100,.2)':'rgba(50, 255, 50,.7)'}} name={app.state==0?'circle-o':'check-circle-o'}/>} 
              rightIcon={
                <div >
                  {('admin|owner|developer|editor'.indexOf(app.userRole) !== -1 || InstaAdminConfig.role=='admin') &&
                    <RouterLink to={this.props.sConfig.baseAdminPath+"/"+this.props.resourceType.toLowerCase()+"s/"+app._id+"/editor"}><Button className={style.resourceMainButton} alt="Editor" icon='mode_edit' >&nbsp;&nbsp;Editor</Button></RouterLink >
                  }
                  {('admin|owner|developer'.indexOf(app.userRole) !== -1 || InstaAdminConfig.role=='admin') &&
                    <RouterLink to={this.props.sConfig.baseAdminPath+"/"+this.props.resourceType.toLowerCase()+"s/"+app._id+"/builder"}><Button className={style.resourceMainButton} alt="Builder" ><FontAwesome className='overwride-ft-rx' name='sitemap'/>&nbsp;&nbsp;Builder</Button></RouterLink >
                  }
                  <IconMenu icon='more_horiz' position='auto' menuRipple>
                  {this.props.resourceType == 'Application' && 'admin|owner|developer|editor|guest'.indexOf(app.userRole) !== -1 &&
                    <MenuItem><Button className={style.resourceSecondaryButton} alt="EndPoint" label='{...}' target='_blank' href={"/api/instaapp/v1/applications/"+app._id+"/object"}>&nbsp;&nbsp;Endpoint</Button></MenuItem>
                  }
                  {('admin|owner|developer'.indexOf(app.userRole) !== -1 || InstaAdminConfig.role=='admin') &&
                    <MenuItem><Button className={style.resourceSecondaryButton} alt="Settings" onClick={()=>{this.setState({dialogApp:app,dialogType:"settings",dialogActive:true});}}><FontAwesome className='overwride-ft-rx' name='cog'/>&nbsp;&nbsp;Settings</Button></MenuItem>
                  }
                  {this.props.resourceType == 'Application' && 'admin|owner|developer'.indexOf(app.userRole) !== -1 &&
                    <MenuItem><Button className={style.resourceSecondaryButton} alt="Hook" onClick={()=>{this.setState({dialogApp:app,dialogType:"hooks",dialogActive:true});}}><FontAwesome className='overwride-ft-rx' name='exchange' />&nbsp;&nbsp;Hooks</Button></MenuItem>
                  }
                  {this.props.resourceType == 'Application' && 'admin|owner|developer'.indexOf(app.userRole) !== -1 &&    
                    <MenuItem><Button className={style.resourceSecondaryButton} alt="Permissions" onClick={()=>{this.setState({dialogApp:app,dialogType:"permissions",dialogActive:true});}}><FontAwesome className='overwride-ft-rx' name='user-plus' />&nbsp;&nbsp;Permissions</Button></MenuItem>
                  }
                  {this.props.resourceType == 'Application' && 'admin|owner|developer'.indexOf(app.userRole) !== -1 &&
                    <MenuItem><Button className={style.resourceSecondaryButton} alt="Duplicate" onClick={()=>{this.setState({dialogApp:app,dialogType:"duplicate",dialogActive:true});}}><FontAwesome className='overwride-ft-rx' name='files-o'/>&nbsp;&nbsp;Duplicate</Button></MenuItem>
                  }
                  </IconMenu>
                </div>
            }/>
            </div>
          )
        }); 

        let buttons = [
          {
            title:"Add",
            action:()=>{this.setState({dialogApp:{},dialogType:"newresource",dialogActive:true});},
            icon: <FontAwesome className='' name='plus'/>
          }
        ];

        return (
          <div>
            <Header title={this.props.resourceType + " List"} subtitle="" buttons={buttons}>
              <DialogType
                dialogType={this.state.dialogType}
                active={this.state.dialogActive}
                appInfo={this.state.dialogApp}
                handleCloseDialog={()=>this.setState({dialogActive:false})}
                resourceType={this.props.resourceType}
                dialogMsg = {this.state.dialogMsg}
                {...this.dialogHandles}/>

              <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly'}}>
                  <div style={{width:'45%'}}>
                    <Input name="namefilter" onChange={this.props.handleChangeName} type="text" label="Filter by name"/>
                  </div>
                  <div style={{width:'45%'}}>
                    <Dropdown label="Filter by type" onChange={(val)=>this.props.handleChangeType(val)} source={this.state.typefilter} />
                  </div>
              </div>
            </Header>

            <List selectable ripple>
              <ListDivider />
              {resourcesItems}
            </List>
          </div>
        )
    }
}

//connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Resources)
