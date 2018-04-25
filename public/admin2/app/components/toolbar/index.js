var React = require('react');
var ReactDOM = require('react-dom');

import {connect } from 'react-redux';
import {AppBar} from 'react-toolbox/lib/app_bar';
import {Drawer} from 'react-toolbox/lib/drawer';
import {List, ListItem, ListSubHeader, ListDivider} from 'react-toolbox/lib/list';
import {Navigation} from 'react-toolbox/lib/navigation';
import {Link} from 'react-toolbox/lib/link';
import {Button} from 'react-toolbox/lib/button';
import FontAwesome from 'react-fontawesome';
import {Menu, IconMenu, MenuItem, MenuDivider} from 'react-toolbox/lib/menu';
import { BrowserRouter as Router, Route, Link as RouterLink} from 'react-router-dom'

import HelpDialog from '../dialogs/helpdialog'

import { getAppActivity, setNotifcationActive, setSideBarActive } from '../../actions'

import theme from './toolbar.scss';

const AdminIcon = () => (
  <svg style={{fontSize:'25px'}} id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><g><path d="M141.888675,0.0234927555 C63.5359948,0.0234927555 0,63.5477395 0,141.912168 C0,204.6023 40.6554239,257.788232 97.0321356,276.549924 C104.12328,277.86336 106.726656,273.471926 106.726656,269.724287 C106.726656,266.340838 106.595077,255.16371 106.533987,243.307542 C67.0604204,251.890693 58.7310279,226.56652 58.7310279,226.56652 C52.2766299,210.166193 42.9768456,205.805304 42.9768456,205.805304 C30.1032937,196.998939 43.9472374,197.17986 43.9472374,197.17986 C58.1953153,198.180797 65.6976425,211.801527 65.6976425,211.801527 C78.35268,233.493192 98.8906827,227.222064 106.987463,223.596605 C108.260955,214.426049 111.938106,208.166669 115.995895,204.623447 C84.4804813,201.035582 51.3508808,188.869264 51.3508808,134.501475 C51.3508808,119.01045 56.8936274,106.353063 65.9701981,96.4165325 C64.4969882,92.842765 59.6403297,78.411417 67.3447241,58.8673023 C67.3447241,58.8673023 79.2596322,55.0538738 106.374213,73.4114319 C117.692318,70.2676443 129.83044,68.6910512 141.888675,68.63701 C153.94691,68.6910512 166.09443,70.2676443 177.433682,73.4114319 C204.515368,55.0538738 216.413829,58.8673023 216.413829,58.8673023 C224.13702,78.411417 219.278012,92.842765 217.804802,96.4165325 C226.902519,106.353063 232.407672,119.01045 232.407672,134.501475 C232.407672,188.998493 199.214632,200.997988 167.619331,204.510665 C172.708602,208.913848 177.243363,217.54869 177.243363,230.786433 C177.243363,249.771339 177.078889,265.050898 177.078889,269.724287 C177.078889,273.500121 179.632923,277.92445 186.825101,276.531127 C243.171268,257.748288 283.775,204.581154 283.775,141.912168 C283.775,63.5477395 220.248404,0.0234927555 141.888675,0.0234927555" /></g></svg>
);

const ActivityMenu = (props) => {
  return (
  <div>
    <Menu theme={theme} active={props.active} onHide={props.onHide} position='topRight' menuRipple={false}>
      <MenuItem  disabled={true} caption='App Activity' />
      <MenuDivider />
      <MenuItem  disabled={true} caption='Apps in Development' />
      {props.developmentApps.map((dApp,i)=>{
        if(i < 5)
          return ( <MenuItem  key={i} icon={<FontAwesome className='overwride-ft-rx' name='wrench'/>} shortcut={dApp.description.substring(0,24)+"..." } caption={dApp.title}></MenuItem> )
        else 
          return null
      })}

      <MenuDivider />
      <MenuItem  disabled={true} caption='Idle Apps' />
      {props.idleApps.map((dApp,i)=>{
        if(i < 5)
          return ( <MenuItem  key={i} icon={<FontAwesome className='overwride-ft-rx' name='clock-o'/>} shortcut={dApp.description.substring(0,24)+"..." } caption={dApp.title}></MenuItem> )
        else 
          return null
      })}
      <MenuDivider />
      <MenuItem  disabled={true} caption='Newest Published Apps' />
      {props.newApps.map((dApp,i)=>{
        if(i < 5)
          return ( <MenuItem  key={i} icon={<FontAwesome className='overwride-ft-rx' name='exclamation'/>} shortcut={dApp.description.substring(0,24)+"..." } caption={dApp.title}></MenuItem> )
        else 
          return null
      })}
    </Menu>
  </div>
  )}
;

const mapStateToProps = (state) => {
  return {
    notificationPanelActive:state.notification.notificationPanelActive,
    sideBarPanelActive:state.sideBarPanelActive,
    sConfig:state.sConfig          
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAppActivity: () => dispatch(getAppActivity()),
    setNotifcationActive:(state)=> dispatch(setNotifcationActive(state)),
    setSideBarActive:(state)=> dispatch(setSideBarActive(state))
  }
}


class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newApps:[],
      developmentApps:[],
      idleApps:[],
      helpDialogActive:false,
      drawerActive:false,
      activityActive:false
    }
  }

  componentDidMount(){
    this.props.getAppActivity().then((resp)=>{
      let appActivity = {
        newApps:[],
        developmentApps:[],
        idleApps:[],
      };
      resp.data.forEach(function(app,i){
        appActivity[app.activity+'Apps'].push(app);
      }); 
      this.setState({...appActivity});
    })
  }

  render() {
    return (
      <AppBar theme={theme} title='Insta Admin' onLeftIconClick={()=>{this.props.setSideBarActive(true);}} leftIcon={this.props.sideBarPanelActive?null:<FontAwesome className='overwride-ft-rx' size="2x" name='bars'/>} rightIcon={<AdminIcon />}>
        {/*<ActivityMenu onHide={()=>this.setState({activityActive:false})} active={this.state.activityActive} newApps={this.state.newApps} developmentApps={this.state.developmentApps} idleApps={this.state.idleApps}/>
        <Button theme={theme} icon="exit_to_app" label='Activity' onClick={()=>this.setState({activityActive:true})} />*/}
        <Button theme={theme} icon="exit_to_app" label='SIGN OUT' onClick={()=>{ location.href="/auth/logout"}} ></Button>
      </AppBar>
    )        
  }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar)
