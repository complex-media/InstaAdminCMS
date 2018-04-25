import React from 'react';

//dialogtype
import AppSettingDialog from './settings';
import AppInfoDialog from './info';
import AppConfirmDialog from './confirm';

export default class AppDialogs extends React.Component {

    constructor(props){
        super(props);
    }


    getDialogCompnent = () =>{
      switch (this.props.dialogType) {
        case 'settings':
          return (<AppSettingDialog {...this.props}/>);
          break;
        case 'info':
          return (<AppInfoDialog {...this.props}/>);
          break;
        case 'confirm':
          return (<AppConfirmDialog {...this.props}/>);
          break;
        default:
          return (null);
      }
    }

    render() {
        return (
          <div>
            {this.getDialogCompnent(this.props.appId)}
          </div>
        )        
    }
}