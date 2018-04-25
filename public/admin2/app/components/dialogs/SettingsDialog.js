import React from 'react';
import {connect } from 'react-redux';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Switch from 'react-toolbox/lib/switch';
import AppDialogs from './appdialogs'
import theme from './dialog.scss'


import apiService from '../../apiService';
import { pushNotification, setNotifcationActive } from '../../actions'

const appStates = [
  { value: 0, label: 'Development' },
  { value: 1, label: 'Production'}
];

class SettingsDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      appId:props.appInfo._id,
      metaData:{
        title:'',
        description:'',
        url:'',
        state:0,
        schemaLock:false,
        dataLock:false,
        tags:'',
        dialogMsg:''
      },
      deleteDialogActive:false
    };
  }

  componentWillMount(){
    if(this.props.appInfo)
      this.getSettings(this.props.appInfo);
  }

  componentWillReceiveProps(nextProps){
    if(this.state.appId != nextProps.appInfo._id)
      this.getSettings(nextProps.appInfo);
  }

  getSettings(data){
    this.setState({appId:data._id});
    apiService.getResource(data._id,this.props.resourceType.toLowerCase()+'s')
    .then((resp)=>{
      let metaData = this.state.metaData;
      Object.keys(resp.data).forEach(function (key) {
        if ('title|description|url|state|schemaLock|dataLock|tags|'.indexOf(key+'|') !== -1) {
          metaData[key] = resp.data[key];
        }
      });

      this.setState({metaData:metaData})
    });
  }

  handleChange = (name, value) => {
    let metaData = this.state.metaData;
    metaData[name] = value;
    this.setState({metaData:metaData});
  };

  handleCancel = () => {
    this.props.handleCloseDialog();
  }

  handleMainAction = () => {
    apiService.updateResourceMeta(this.props.appInfo._id,this.state.metaData,this.props.resourceType.toLowerCase()+'s')
    .then((resp)=>{
      let msgObj = {
        msg:resp.response,
        type:resp.status
      }
      this.props.pushNotification(msgObj)
      if(resp.status == 'ok') {
        this.props.handleUpdateSettingsCallback()
      }else{
        this.setState({dialogMsg:resp.response})
      }
        
    });
  }

  handleDelete = () =>{
    apiService.deleteResource(this.props.appInfo._id,this.props.resourceType.toLowerCase()+'s')
    .then((resp)=>{
      let msgObj = {
        msg:resp.response,
        type:resp.status
      }
      this.props.pushNotification(msgObj)
      this.setState({deleteDialogActive:false});
      this.props.handleDeleteResource();
    });
  }

  render() {
    let actions = [
        { label: "Cancel", onClick: this.handleCancel },
        { label: "Delete", onClick: ()=>this.setState({deleteDialogActive:true}) },
        { label: "Save", disabled:this.state.metaData.title.length < 10 || this.state.metaData.description.length < 10, onClick: this.handleMainAction }
    ];

    return (
        <Dialog
          theme={theme}
          actions={actions}
          active={this.props.active}
          onEscKeyDown={this.handleCancel}
          onOverlayClick={this.handleCancel}
          title={this.props.resourceType +' Settings'}
        >

        <AppDialogs
          active={this.state.deleteDialogActive}
          dialogType='confirm'
          closeDialog={()=>this.setState({deleteDialogActive: false})}
          actionDialogCallback={()=>this.handleDelete()} />
          
          <section className={theme.content}>
            
            <Input error={this.state.metaData.description.length < 10 ? 'Description must be 10 characters long':false} required type='text' multiline label='Description' maxLength={200} value={this.state.metaData.description} onChange={this.handleChange.bind(this, 'description')} />
            <Input error={this.state.metaData.title.length < 10 ? 'Title must be 10 characters long':false} required type='text' label='Title' value={this.state.metaData.title} onChange={this.handleChange.bind(this, 'title')} maxLength={16} />
            {this.props.resourceType == 'Application' &&
              <Input type='text' label='App Url' value={this.state.metaData.url} onChange={this.handleChange.bind(this, 'url')} maxLength={16} />
            }
            <span></span>
            {this.props.resourceType == 'Component' &&
              <Input required type='text' label='Component Type' name='tag' value={this.state.metaData.tags} onChange={this.handleChange.bind(this,'tags')} maxLength={40} />
            }
            <Dropdown auto onChange={this.handleChange.bind(this, 'state')} source={appStates} value={this.state.metaData.state} />
            <Switch checked={this.state.metaData.schemaLock} label="Schema Locked" onChange={this.handleChange.bind(this, 'schemaLock')} />
            <Switch checked={this.state.metaData.dataLock} label="Data Locked" onChange={this.handleChange.bind(this, 'dataLock')} />
            <div className={theme.dialogMsg}>{this.state.dialogMsg}</div>
          </section>
        </Dialog>
      
    )        
  }
}

const mapStateToProps = (state) => {
  return {}          
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushNotification:(value)=>{
      dispatch(pushNotification(value));
    }
  }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsDialog)
