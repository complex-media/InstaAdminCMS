var React = require('react');
var ReactDOM = require('react-dom');
import {connect } from 'react-redux';
import Button from 'react-toolbox/lib/button';
import FontAwesome from 'react-fontawesome';
import { pushNotification, setNotifcationActive } from '../../actions'
import theme from './header.scss'

const mapStateToProps = (state) => {
  return {
    notifications:state.notification.history,
    currentNotificationObject:state.notification.currentNotificationObject,
    notificationPanelActive:state.notification.notificationPanelActive
  }          
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushNotification:(value)=>{
      dispatch(pushNotification(value));
    },
    setNotifcationActive:(state)=>{
      dispatch(setNotifcationActive(state));
    }
  }
}

class Notification extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        msgTypes:{
            'ok':{fa:'check-circle-o',c:'lightgreen'},
            'err':{fa:'times-circle-o',c:'red'},
            'info':{fa:'info',c:'lightyellow'},
            'warning':{fa:'exclamation',c:'orange'},
        },
        showHistory:false
    };
  }

  notify(currentMsg,currentType){
    let notifications = this.state.notifications;
    notifications.unshift({msg:currentMsg,status:currentType})
    this.setState(notifications,currentMsg,currentType,notificationActive:true);
  }
  
  buildMessageHistory(){

    return(
        <div>
            {this.props.notifications.map((msgObj,i)=>{
                if(i===0) {
                    return (null)
                }
                return(
                    <div key={i} className={theme.notificationHistoryItem} style={{color:this.state.msgTypes[msgObj.type].c}}>
                        <div style={{width:'30px'}}><FontAwesome name={this.state.msgTypes[msgObj.type].fa}/>&nbsp;&nbsp;&nbsp;</div>
                        <div>{msgObj.msg}</div>
                    </div>
                )
            })}
        </div>
    )
  }

  render() {
    let children = this.buildMessageHistory()
    return (
      <div style={{position:'absolute',left:'50%',bottom:'20px'}}>
        <section className={theme.notificationContainer} style={{display:this.props.notificationPanelActive?'block':'none'}}>
          <div className={theme.notificationTitle}>
            <div className={theme.notificationLastMessage} style={{color:this.state.msgTypes[this.props.currentNotificationObject.type].c}}>
              <div><FontAwesome name={this.state.msgTypes[this.props.currentNotificationObject.type].fa}/>&nbsp;&nbsp;&nbsp;</div>
              <div>{this.props.currentNotificationObject.msg}</div>
            </div>
            <div>
              <Button mini floating flat className={theme.notificationButton} onClick={()=>this.setState({showHistory:!this.state.showHistory})}><FontAwesome style={{color:'#efefef'}} name={this.state.showHistory?'chevron-down':'chevron-up'}/></Button>
              <Button mini floating flat className={theme.notificationButton} onClick={()=>{this.props.setNotifcationActive(false)}}><FontAwesome style={{color:'#efefef'}} name='times'/></Button>
            </div>
          </div>
          <div className={theme.notificationMessageHistory} style={{display:this.state.showHistory?'block':'none'}}>
            {children}
          </div>
        </section>
      </div>
    )        
  }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification)