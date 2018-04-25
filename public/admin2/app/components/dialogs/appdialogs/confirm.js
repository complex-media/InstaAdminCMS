import React from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import {Dialog} from 'react-toolbox/lib/dialog';
import Switch from 'react-toolbox/lib/switch';
import theme from './appdialogs.scss';


import apiService from '../../../apiService';

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
          actions={actions}
          active={this.props.active}
          onEscKeyDown={this.handleCancel}
          onOverlayClick={this.handleCancel}
          theme={theme}
          title='Are you sure?'
        >
          <p className='footer-info'>Confirm</p>
        </Dialog>
      
    )        
  }
}