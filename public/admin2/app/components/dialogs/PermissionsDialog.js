import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Button from 'react-toolbox/lib/button';
import {Tab, Tabs} from 'react-toolbox/lib/tabs'
import Autocomplete from 'react-toolbox/lib/autocomplete';
import apiService from '../../apiService';
import theme from './dialog.scss'

//<NewResourceDialog resourceType={this.state.newResourceType} active={this.state.newResourceDialogActive} resource={this.state.newResource} handleResourceCreate={(...args)=>this.handleResourceCreate(...args);} handleCloseDialog={()=>this.setState({newResourceDialogActive:false})}/>
export default class PermissionDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      errors:{
      },
      allUsers:[],
      appUsers:[],
      roles:[
        {value:"owner",label:"owner"},
        {value:"developer",label:"developer"},
        {value:"editor",label:"editor"},
        {value:"guest",label:"guest"}
      ],
      inviteEmail:'',
      inviteRole:'',
      newResourceHandle:'',
      newResourceRole:'',
      tabIndex:0

    } 
  }

  componentDidMount(){
    apiService.getUsers().then((resp)=>{
      this.setState({allUsers:resp.data})
    })

    if(this.props.active ===true){
      this._getAppUsers(this.props.appInfo._id);
    }
  }

    //better way to do this
  componentWillReceiveProps(nextProps){
    if(this.props.active != nextProps.active && nextProps.active ===true){
      this._getAppUsers(nextProps.appInfo._id);
    }
  }

  _getAppUsers(id){
    apiService.getAppUsers(id).then((resp)=>{
      this.setState({appUsers:resp.data.map((appUser)=>{
        appUser.originalRole = appUser.role;
        return appUser;
      })});
    });
  }

  handleChangeAppUserRole(role,i){
    let appUsers = this.state.appUsers;
    appUsers[i].role = role;
    this.setState({appUsers});

  }

  handleAddNewResourceUser(){
    let user = this.state.allUsers.filter((user)=>{return this.state.newResourceHandle == user.local.email})[0];
    this.props.handleAddNewResourceUser(this.props.appInfo.title,user,this.state.newResourceRole,this.props.appInfo._id)
    .then((resp)=>{
      if(resp.status=='ok'){
        this._getAppUsers(this.props.appInfo._id);
      }
    });
  }

  handleUpdateAppUserRole(appUser){
    this.props.handleUpdateAppUserRole(appUser,this.props.appInfo._id)
    .then((resp)=>{
      if(resp.status=='ok'){
        this._getAppUsers(this.props.appInfo._id);
      }
    });
  }

  handleDeleteResourceUser(appUser){
    this.props.handleDeleteResourceUser(appUser._id,appUser.role)
    .then((resp)=>{
      if(resp.status=='ok'){
        this._getAppUsers(this.props.appInfo._id);
      }
    });
  }

  _validate(val,field){

  }

  render() {
   let usersAutoCompleteSource =  this.state.allUsers.reduce((last,user)=>{last[user.local.email] = user.local.email; return last},{});

   return(
      <Dialog
        theme={theme}
        actions={[
                  { label: "Close", onClick:this.props.handleCloseDialog},
                ]}
        active={this.props.active}
        onEscKeyDown={this.props.handleCloseDialog}
        onOverlayClick={this.props.handleCloseDialog}
        title={'User Permissions'} >
        <section className={theme.content}>
          <Tabs index={this.state.tabIndex} fixed onChange={(index)=>{this.setState({tabIndex:index})}}>
            <Tab label='Users'>
              <div>
                {this.state.appUsers.map((appUser,i)=>(
                  <div style={{backgroundColor:i%2?'rgb(245, 245, 245)':'rgb(255, 255, 255)'}}>
                    <div>{appUser.handle}</div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                      <div><Dropdown auto label="" onChange={(val)=>{this.handleChangeAppUserRole(val,i)}} source={this.state.roles} value={appUser.role}/></div>
                      <div><Button alt='Update Role' onClick={()=>{this.handleUpdateAppUserRole(appUser)}} raised >&nbsp;Update</Button></div>
                      <div><Button alt='Delete Role' onClick={()=>{this.handleDeleteResourceUser(appUser)}} raised >&nbsp;Delete</Button></div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab>

            <Tab label='Invite'>
              <div>
                Invite
                <div>
                  <Input error={this.state.inviteEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null?"Must be valide Email":false}required type='text' label='Email' name='InviteEmail' value={this.state.inviteEmail} onChange={(val)=>{this.setState({inviteEmail:val})}} maxLength={50} />
                  <Dropdown auto allowBlank={false} label='Role' onChange={(val)=>{this.setState({inviteRole:val})}} source={this.state.roles} value={this.state.inviteRole} />
                  <Button disabled={this.state.inviteEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null} alt='Invite' onClick={()=>{this.props.handleInviteUser(this.state.inviteEmail,this.state.inviteRole,this.props.appInfo._id)}}raised >&nbsp;Invite</Button>
                </div>
              </div>
            </Tab>

            <Tab label='New Users'>
              <div>
                New Resource Users
                <div>
                  <Autocomplete
                    direction="down"
                    selectedPosition="above"
                    label="Choose User"
                    hint="Handle"
                    multiple={false}
                    onChange={(val)=>{this.setState({newResourceHandle:val})}}
                    source={usersAutoCompleteSource}
                    value={this.state.newResourceHandle} />
                  <Dropdown auto allowBlank={false} label='Role' onChange={(val)=>{this.setState({newResourceRole:val})}} source={this.state.roles} value={this.state.newResourceRole} />
                  <Button alt='Add' onClick={()=>{this.handleAddNewResourceUser()}} raised >&nbsp;Add</Button>
                </div>
              </div>
            </Tab>
          </Tabs>
          <div className={theme.dialogMsg}>{this.props.dialogMsg}</div>
        </section>
      </Dialog>
    )       
  }
}
