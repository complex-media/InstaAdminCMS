import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import theme from './dialog.scss'

//<NewResourceDialog resourceType={this.state.newResourceType} active={this.state.newResourceDialogActive} resource={this.state.newResource} handleResourceCreate={(...args)=>this.handleResourceCreate(...args);} handleCloseDialog={()=>this.setState({newResourceDialogActive:false})}/>
export default class DuplicateDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      errors:{
      },
      duplicateResource:{
        title:'',
        description:'',
        appurl:'',
        tags:[]
      },
      duplicateId:props.appInfo._id
    } 
  }

  handleInputChange(val,field){
    let duplicateResource = this.state.duplicateResource;
    duplicateResource[field] = val;
    this._validate(val,field);
    this.setState({duplicateResource})
  }

  _validate(val,field){

  }

  handleResourceDuplication(){

    this.props.handleDuplicate({...this.state.duplicateResource,duplicateId:this.state.duplicateId})
  }

  render() {
   return(
      <Dialog
        theme={theme}
        actions={[
                  { label: "Cancel", onClick:this.props.handleCloseDialog},
                  { label: "Create", onClick:()=>{this.handleResourceDuplication()}, disabled: this.state.duplicateResource.title.length < 10 || this.state.duplicateResource.description.length < 10 }
                ]}
        active={this.props.active}
        onEscKeyDown={this.props.handleCloseDialog}
        onOverlayClick={this.props.handleCloseDialog}
        title={'Duplicate '+this.props.resourceType} >
        <section className={theme.content}>
          <Input error={this.state.duplicateResource.title.length < 10 ? 'Title must be at least 10 characters':false} required type='text' label='Title' name='title' value={this.state.duplicateResource.title} onChange={(val)=>{this.handleInputChange(val,'title')}} maxLength={50} />
          <Input error={this.state.duplicateResource.description.length < 10 ? 'Title must be at least 10 characters':false} required type='text' label='Description' name='description' value={this.state.duplicateResource.description} onChange={(val)=>{this.handleInputChange(val,'description')}} maxLength={200} />
          <Input required type='text' label='App Url' name='appurl' value={this.state.duplicateResource.appurl} onChange={(val)=>{this.handleInputChange(val,'appurl')}} maxLength={100} />
          <div className={theme.dialogMsg}>{this.props.dialogMsg}</div>
        </section>
      </Dialog>
    )       
  }
}
