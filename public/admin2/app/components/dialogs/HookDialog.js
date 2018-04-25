import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import apiService from '../../apiService';
import theme from './dialog.scss'

//<NewResourceDialog resourceType={this.state.newResourceType} active={this.state.newResourceDialogActive} resource={this.state.newResource} handleResourceCreate={(...args)=>this.handleResourceCreate(...args);} handleCloseDialog={()=>this.setState({newResourceDialogActive:false})}/>
export default class HookDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      errors:{
      },
      onPublish:{
        method:'',
        regexValue:'',
        request:'',
        responsePath:'',
        responseType:''
      },
      appId:props.appInfo._id,
    } 
  }

  componentWillMount(){
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
      if(resp.data.hooks){
        this.setState({onPublish:resp.data.hooks.onPublish});
      } else {
        this.setState({onPublish:
          {
            method:'',
            regexValue:'',
            request:'',
            responsePath:'',
            responseType:''
          }
        });
      } 
    });
  }

  handleOnPublishChange(val,field){
    let onPublish = this.state.onPublish;
    onPublish[field] = val
    
    this.setState({onPublish})
  }

  _validate(type,val,field){

  }

  handleHookUpdate(){

    let hooks = {
      onPublish:this.state.onPublish
    };

    this.props.handleSaveHook(hooks)
  }

  render() {
   return(
      <Dialog
        theme={theme}
        actions={[
                  { label: "Cancel", onClick:this.props.handleCloseDialog},
                  { label: "Update", disabled:this.state.onPublish.request.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \(\)\\?\_\$\#\*\)\~\%\@\(\^\`\!\|\+\~\&\,\%\=\.-]*)*\/?$/) == null || this.state.onPublish.request.regexValue == '' || this.state.onPublish.request.responsePath == '', onClick:()=>{this.handleHookUpdate()}}
                ]}
        active={this.props.active}
        onEscKeyDown={this.props.handleCloseDialog}
        onOverlayClick={this.props.handleCloseDialog}
        title={"Update Hook"} >
        <section className={theme.content}>
          <div>
            <div>On Publish Hook</div>
          </div>
          <Input error={this.state.onPublish.request.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \(\)\\?\_\$\#\*\)\~\%\@\(\^\`\!\|\+\~\&\,\%\=\.-]*)*\/?$/) == null?'Must be valid endpoint url':false} required type='text' label='Endpoint' name='title' value={this.state.onPublish.request} onChange={(val)=>{this.handleOnPublishChange(val,'request')}} />
          <Input error={this.state.onPublish.regexValue == ''?"Can't be blank.":false} required type='text' label='Match(Regex)' name='title' value={this.state.onPublish.regexValue} onChange={(val)=>{this.handleOnPublishChange(val,'regexValue')}} maxLength={50} />
          <Input error={this.state.onPublish.responsePath == ''?"Can't be blank.":false} required type='text' label='Response Path (Dot Notation)' name='title' value={this.state.onPublish.responsePath} onChange={(val)=>{this.handleOnPublishChange(val.replace(/[^0-9a-zA-Z\.]/gi, ''),'responsePath')}} maxLength={50} />
          <Dropdown auto allowBlank={false} label='Method' onChange={(val)=>{this.handleOnPublishChange(val,'method')}} source={[{value:'get',label:'GET'},{value:'post',label:"POST"}]} value={this.state.onPublish.method} />
          <Dropdown auto allowBlank={false} label='Method' onChange={(val)=>{this.handleOnPublishChange(val,'responseType')}} source={[{value:'json',label:'json'}]} value={this.state.onPublish.responseType} />
          <div className={theme.dialogMsg}>{this.props.dialogMsg}</div>
        </section>
      </Dialog>
    )       
  }
}
