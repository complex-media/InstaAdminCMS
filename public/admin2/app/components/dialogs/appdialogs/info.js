import React from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import {Dialog} from 'react-toolbox/lib/dialog';
import {Button,IconButton} from 'react-toolbox/lib/button';
import FontAwesome from 'react-fontawesome';
import Switch from 'react-toolbox/lib/switch';
import theme from './appdialogs.scss';

export default class AppInfoDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillMount(){}

  componentWillReceiveProps(nextProps){}

  render() {
    let actions = [
        { label: "Close", onClick: this.props.closeDialog }
    ];

    return (
        <Dialog
          actions={actions}
          active={this.props.active}
          onEscKeyDown={this.props.closeDialog}
          onOverlayClick={this.props.closeDialog}
          theme={theme}
          title='Information'
        >
          <section style={{width:'100%'}}>
            <Button alt='Info' raised target='_blank' href={"/api/instaapp/v1/applications/"+this.props.appId+"/object"}><FontAwesome name='eye'/>&nbsp;JSON FORMATTED DATA</Button>
            <Button alt='Info' raised target='_blank' href={"/api/instaapp/v1/applications/"+this.props.appId}><FontAwesome name='eye'/>&nbsp;JSON RAW DATA</Button>
          </section>
          <p className='footer-info'></p>
        </Dialog>
      
    )        
  }
}