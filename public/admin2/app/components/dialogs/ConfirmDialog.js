import React from 'react';
import {Dialog} from 'react-toolbox/lib/dialog';
import Switch from 'react-toolbox/lib/switch';
import theme from './dialog.scss'

export default class AppConfirmDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }


  handleCancel = () => {
    this.props.closeDialog();
  }

  handleMainAction = () => {
    this.props.actionDialogCallback()
  }

  render() {
    let actions = [
        { label: "Cancel", onClick: this.handleCancel },
        { label: "Ok", onClick: this.handleMainAction }
    ];

    return (
        <Dialog
          theme={theme}
          actions={actions}
          active={this.props.active}
          onEscKeyDown={this.props.closeDialog}
          onOverlayClick={this.props.closeDialog}
          title='Are you sure?'
          >
        </Dialog>
      
    )        
  }
}