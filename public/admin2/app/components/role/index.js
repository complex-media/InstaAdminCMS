//todo break this into containe-componenet
import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import {Button} from 'react-toolbox/lib/button';
import Dropdown from 'react-toolbox/lib/dropdown';

import Header from '../header';
import theme from './role.scss';

import { getRoles, updateRoles, deleteUser, reIssueUserCreds } from '../../actions'

const mapStateToProps = (state) => {
  return {             
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRoles: () => dispatch(getRoles()),
    deleteUser: (id) => dispatch(deleteUser(id)),
    updateRoles: (id,put) => dispatch(updateRoles(id,put)),
    reIssueUserCreds: (handle) => dispatch(reIssueUserCreds(handle)),
  }
}

class Role extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        userRoles:[],
        roles:[
          {value:'admin',label:'admin'},
          {value:'owner',label:'owner'},
          {value:'user',label:'user'},
        ]
      }
    }

    componentDidMount(){
      this._getSetRoles();
    }

    _getSetRoles(){
      this.props.getRoles()
      .then((resp)=>{
        this.setState({userRoles:resp.data});
      });
    }

    handleUpdateUserRole(userRole){
      this.props.updateRoles(userRole._id,userRole.role)
      .then((resp)=>{
        this._getSetRoles();
      });
    }

    handleDeleteUser(userRole){
      this.props.deleteUser(userRole._id)
      .then((resp)=>{
        this._getSetRoles();
      });
    }

    handleReissueCreds(userRole){
      this.props.reIssueUserCreds(userRole.handle)
      .then((resp)=>{

      });
    }

    handleChange(role,i){
      let userRoles = this.state.userRoles;
      userRoles[i].role = role;
      this.setState({userRoles});

    }

    render() {
        return (
          <div>
            <Header title={"User Role Admin"} subtitle="Update user roles."/>
            <div className={theme.userRolesContainer}>
              {this.state.userRoles.map((userRole,i)=>(
                <div className={theme.userRole} style={{backgroundColor:i%2==0?'#ffffff':'#efefef'}}>
                  <div className={theme.handle}>{userRole.handle}</div>
                  <div><Dropdown auto label="Role" onChange={(val)=>{this.handleChange(val,i)}} source={this.state.roles} value={userRole.role}/></div>
                  <div><Button alt='Update Role' onClick={()=>{this.handleUpdateUserRole(userRole)}} raised >&nbsp;Update</Button></div>
                  <div><Button alt='Delete User' onClick={()=>{this.handleDeleteUser(userRole)}} raised >&nbsp;Delete</Button></div>
                  <div><Button alt='ReIssue Creds' onClick={()=>{this.handleReissueCreds(userRole)}} raised >&nbsp;ReIssue</Button></div>
                </div>
              ))}
            </div>
          </div>
        )        
    }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Role)