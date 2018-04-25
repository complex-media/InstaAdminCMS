import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Button from 'react-toolbox/lib/button';
import FontAwesome from 'react-fontawesome';
import theme from './dialog.scss'

//<NewResourceDialog resourceType={this.state.newResourceType} active={this.state.newResourceDialogActive} resource={this.state.newResource} handleResourceCreate={(...args)=>this.handleResourceCreate(...args);} handleCloseDialog={()=>this.setState({newResourceDialogActive:false})}/>
export default class InfoDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        actions:[{ label: "Close", onClick: props.closeDialog }]
    } 
  }

  render() {
      return (
       <Dialog
        theme={theme}
        actions={this.state.actions}
        active={this.props.active}
        onEscKeyDown={this.props.closeDialog}
        onOverlayClick={this.props.closeDialog}
        title='Information'
        >
          <section className={theme.content}>
            <Button alt='Info' raised target='_blank' href={"/api/instaapp/v1/applications/"+this.props.appId+"/object"}><FontAwesome name='eye'/>&nbsp;JSON FORMATTED DATA</Button>
            <Button alt='Info' raised target='_blank' href={"/api/instaapp/v1/applications/"+this.props.appId}><FontAwesome name='eye'/>&nbsp;JSON RAW DATA</Button>
            <div className={theme.dialogMsg}>{this.props.dialogMsg}</div>
          </section>
        </Dialog>
      )      
  }
}
