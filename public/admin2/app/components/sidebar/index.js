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
import { BrowserRouter as Router, Route, Link as RouterLink, withRouter} from 'react-router-dom'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

import HelpDialog from '../dialogs/helpdialog'

import { getAppActivity, setNotifcationActive, setSideBarActive } from '../../actions'

import css from './sidebar.scss';

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


class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newApps:[],
      developmentApps:[],
      idleApps:[],
      helpDialogActive:false
    }

    if(window.innerWidth < 1200 ){
      this.props.setSideBarActive(false);
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

  handleToggleNotification(){
    this.props.setNotifcationActive(!this.props.notificationPanelActive);
  }

  pathSelected(pathEnd){
    return (this.props.location.pathname.indexOf(pathEnd) !== -1);
  }


  render() {
    return (
  
        <aside className={css.sidebar} style={{display:this.props.sideBarPanelActive?'block':'none'}}>
          <Card className={css.card}>
            <FontAwesome className={css.closeIcon} name='chevron-left' onClick={()=>this.props.setSideBarActive(false)}/>
            <CardTitle avatar="/admin/src/assets/images/avatars/profile.jpg" />
            <CardTitle theme={css} title={this.props.sConfig.handle} subtitle={"role: "+this.props.sConfig.role} />
          </Card>
          <Navigation className={css.navigation} type='vertical'>
              <List selectable ripple >
                <ListSubHeader caption='Builder'/>
                <RouterLink style={{textDecoration: 'none'}} to={this.props.sConfig.baseAdminPath+"/applications"}  onClick={()=>this.props.setSideBarActive(false)}><ListItem className={this.pathSelected('applications')?css.selected:null} theme={css} leftIcon='apps' caption='Applications' /></RouterLink >
                {this.props.sConfig.role == 'admin' &&
                  <div>
                    <RouterLink style={{textDecoration: 'none'}} to={this.props.sConfig.baseAdminPath+"/templates"}  onClick={()=>this.props.setSideBarActive(false)}><ListItem className={this.pathSelected('templates')?css.selected:null} theme={css} leftIcon='group_work' caption='Templates' /></RouterLink >
                    <RouterLink style={{textDecoration: 'none'}} to={this.props.sConfig.baseAdminPath+"/components"}  onClick={()=>this.props.setSideBarActive(false)}><ListItem className={this.pathSelected('components')?css.selected:null} theme={css} leftIcon='bubble_chart' caption='Components' /></RouterLink >
                  </div>
                }
                {this.props.sConfig.role == 'admin' &&
                  <div>
                    <ListDivider />
                    <ListSubHeader caption='Users'/>
                    <RouterLink style={{textDecoration: 'none'}} to={this.props.sConfig.baseAdminPath+"/invite"}  onClick={()=>this.props.setSideBarActive(false)}><ListItem className={this.pathSelected('invite')?css.selected:null} theme={css} leftIcon={<FontAwesome className='overwride-ft-rx' name='envelope-open-o'/>} caption='User Invite'  /></RouterLink>
                    <RouterLink style={{textDecoration: 'none'}} to={this.props.sConfig.baseAdminPath+"/role"}  onClick={()=>this.props.setSideBarActive(false)}><ListItem className={this.pathSelected('role')?css.selected:null} theme={css} leftIcon={<FontAwesome className='overwride-ft-rx' name='user-circle-o'/>} caption='User Role'/></RouterLink>
                  </div>
                }   
                <ListDivider />
                <ListDivider />
                <ListSubHeader caption='Account'/>
                <RouterLink style={{textDecoration: 'none'}} to={this.props.sConfig.baseAdminPath+"/profile"}  onClick={()=>this.props.setSideBarActive(false)}><ListItem className={this.pathSelected('profile')?css.selected:null} theme={css} leftIcon={<FontAwesome className='overwride-ft-rx' name='users'/>} caption='Profile'  /></RouterLink>      
                <ListItem leftIcon={<FontAwesome className='overwride-ft-rx' name='bell-o'/>} caption='Notifications' onClick={()=>{this.handleToggleNotification()}}/>
                <ListItem leftIcon={<FontAwesome className='overwride-ft-rx' name='question-circle-o'/>} caption='Help' onClick={()=>this.setState({helpDialogActive:true})}/>
              </List>
          </Navigation>
          <HelpDialog active={this.state.helpDialogActive} handleCloseDialog={()=>{this.setState({helpDialogActive:false})}}/>
        </aside>
    )        
  }
}

// const SideBarWithRouter = withRouter(SideBar)
// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar)
