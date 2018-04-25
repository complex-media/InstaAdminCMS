import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import theme from './dialog.scss'

//<NewResourceDialog resourceType={this.state.newResourceType} active={this.state.newResourceDialogActive} resource={this.state.newResource} handleResourceCreate={(...args)=>this.handleResourceCreate(...args);} handleCloseDialog={()=>this.setState({newResourceDialogActive:false})}/>
export default class NewResourceDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      errors:{
      },
      newResource:{
        title:'',
        description:'',
        appurl:'',
        templateId:'',
        tags:''
      },
      templates:[{value:false,label:'No Template'}]
    } 
  }

  componentDidMount(){
    this.props.getTemplates()
    .then((resp)=>{
      let templates = resp.data.map((template)=>{return {value:template._id,label:template.title}});
      console.log(templates);
      templates.unshift({value:'false',label:'No Template'});

      this.setState({templates});
    });
  }

  handleInputChange(val,field){
    let newResource = this.state.newResource;
    newResource[field] = val;
    this._validate(val,field);
    this.setState({newResource})
  }

  handleCloseDialog(){
    this.setState({newResource:{
        title:'',
        description:'',
        appurl:'',
        templateId:'',
        tags:''
      }})
    this.props.handleCloseDialog();
  }

  _validate(val,field){

  }

  render() {
   return(
      <Dialog
        theme={theme}
        actions={[
                  { label: "Cancel", onClick:()=>this.handleCloseDialog()},
                  { label: "Create", disabled:this.state.newResource.title < 10 || this.state.newResource.description < 10, onClick:()=>{this.props.handleResourceCreate(this.state.newResource)}}
                ]}
        active={this.props.active}
        onEscKeyDown={()=>this.handleCloseDialog()}
        onOverlayClick={()=>this.handleCloseDialog()}
        title={'Create New'+this.props.resourceType} >
        <section className={theme.content}>
          <Input error={this.state.newResource.title.length < 10 ? 'Title must be 10 characters long':false} required type='text' label='Title' name='title' value={this.state.newResource.title} onChange={(val)=>{this.handleInputChange(val,'title')}} maxLength={50} />
          <Input error={this.state.newResource.description.length < 10 ? 'Title must be 10 characters long':false} required type='text' label='Description' name='description' value={this.state.newResource.description} onChange={(val)=>{this.handleInputChange(val,'description')}} maxLength={200} />
          
          {this.props.resourceType == 'Application' &&
            <div>
              <Input type='text' label='App Url' name='appurl' value={this.state.newResource.appurl} onChange={(val)=>{this.handleInputChange(val,'appurl')}} maxLength={100} />
              <Dropdown auto allowBlank={false} label='Use A Template' onChange={(val)=>{this.handleInputChange(val,'templateId')}} source={this.state.templates} value={this.state.newResource.templateId} />
            </div>
          }

          {this.props.resourceType == 'Component' &&
            <Input required type='text' label='Component Type' name='tag' value={this.state.newResource.tags} onChange={(val)=>{this.handleInputChange(val,'tags')}} maxLength={50} />
          }
          <div className={theme.dialogMsg}>{this.props.dialogMsg}</div>
        </section>
      </Dialog>
    )       
  }
}
