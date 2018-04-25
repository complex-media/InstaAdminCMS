import React from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import {Dialog} from 'react-toolbox/lib/dialog';
import Switch from 'react-toolbox/lib/switch';
import theme from './appdialogs.scss';
import AppDialogs from './index.js'


import apiService from '../../../apiService';

const appStates = [
  { value: 0, label: 'Development' },
  { value: 1, label: 'Production'}
];

export default class AppSettingDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      appId:props.appId,
      metaData:{
        title:'',
        description:'',
        url:'',
        state:0,
        schemaLock:false,
        dataLock:false
      },
      deleteDialogActive:false
    };
  }

  componentWillMount(){
    this.getSettings(this.props);
  }

  componentWillReceiveProps(nextProps){
    if(this.state.appId != nextProps.appId)
      this.getSettings(nextProps);
  }

  getSettings(data){
    this.setState({appId:data.appId});
    apiService.getApplication(data.appId,(resp)=>{
      let filtered = {};
      Object.keys(resp.data).forEach(function (key) {
        if ('title|description|url|state|schemaLock|dataLock'.indexOf(key+'|') !== -1) {
          filtered[key] = resp.data[key];
        }
      });
      console.log(filtered);
      this.setState({metaData:filtered})
    });
  }

  handleChange = (name, value) => {
    this.setState({metaData:{...this.state.metaData,[name]: value}});
  };

  handleCancel = () => {
    this.props.closeDialog();
  }

  handleMainAction = () => {
    apiService.updateApplicationMeta(this.props.appId,this.state.metaData,()=>this.props.actionDialogCallback());
  }

  handleDelete = () =>{
    apiService.deleteResource(this.props.appId)
    .then((resp)=>{
      this.props.actionDialogCallback()
    });
  }

  handleAction = () =>{
    console.log('action from class');
  }

  render() {
    let actions = [
        { label: "Cancel", onClick: this.handleCancel },
        { label: "Delete", onClick: ()=>this.setState({deleteDialogActive:true}) },
        { label: "Save", onClick: this.handleMainAction }
    ];

    return (
        <Dialog
          actions={actions}
          active={this.props.active}
          onEscKeyDown={this.handleCancel}
          onOverlayClick={this.handleCancel}
          theme={theme}
          title='Application Settings'
        >

        <AppDialogs
          active={this.state.deleteDialogActive}
          dialogType='confirm'
          closeDialog={()=>this.setState({deleteDialogActive: false})}
          actionDialogCallback={()=>this.handleDelete()} />
          
          <section style={{height:'60vh', overflowY:'scroll',overflowX:'hidden'}}>
            <Input type='text' label='Title' value={this.state.metaData.title} onChange={this.handleChange.bind(this, 'title')} maxLength={16} />
            <Input type='text' multiline label='Description' maxLength={200} value={this.state.metaData.description} onChange={this.handleChange.bind(this, 'description')} />
            <Input type='text' label='App Url' value={this.state.metaData.url} onChange={this.handleChange.bind(this, 'url')} maxLength={16} />
            <Dropdown auto onChange={this.handleChange.bind(this, 'state')} source={appStates} value={this.state.metaData.state} />
            <Switch checked={this.state.metaData.schemaLock} label="Schema Locked" onChange={this.handleChange.bind(this, 'schemaLock')} />
            <Switch checked={this.state.metaData.dataLock} label="Data Locked" onChange={this.handleChange.bind(this, 'dataLock')} />
          </section>
          <p className='footer-info'>*Settings</p>
        </Dialog>
      
    )        
  }
}