//todo break this into containe-componenet
import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import {Button} from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

import Header from '../header';

import { getProfile, updateProfileEmail, updateProfilePassword, deleteOAuth } from '../../actions'

const mapStateToProps = (state) => {
  return {             
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: () => dispatch(getProfile()),
    updateProfileEmail: (email) => dispatch(updateProfileEmail(email)),
    updateProfilePassword: (pw) => dispatch(updateProfilePassword(pw)),
    deleteOAuth: (oauthtype) => dispatch(deleteOAuth(oauthtype))
  }
}

const OauthInfo = (props) => (
  <div>
    {props.name}
    {props.email}
    {props.id}
    <img src="/admin/dist/assets/images/logos/google.png" alt="Smiley face" />
  </div>
)

class Profile extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        email:'',
        password:'',
        passwordVerify:'',
        profile:{
          local:{
            email:''
          }
        },
        errors:{
          password:{},
          email:{}
        }
      }
    }

    componentDidMount(){
      this._getProfile();
    }

    _getProfile(){
      this.props.getProfile()
      .then((resp)=>{
        this.setState({profile:resp.data});
      });
    }

    validateForm(val,field){
      let errors = this.state.errors;
      if(field == 'password') {
        if(val.match(/^[a-zA-Z0-9]*$/) == null || val.length < 8){
            errors.password['regex'] = 'Password needs to be alphanumercia and at least 8 characters long.';
        } else {
            delete errors.password.regex;
        }
      }

      if(field == 'email'){
        if(val.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null){
          errors.email['regex'] = 'Needs to be a proper email.';
        } else {
          delete errors.email.regex;
        }
      }
      this.setState({errors})
    }

    handleChange(val,field){
      let state = {}
      state[field] = val;
      this.setState(state);
      this.validateForm(val,field)
    }

    handleAddOAuth(){
      window.location.href = "/auth/me/oauth";
    }

    handleUpdatePassword(){
      this.props.updateProfilePassword(this.state.password)
      .then((resp)=>{
        this._getProfile();
      });
    }

    handleUpdateEmail(){
      this.props.updateProfileEmail(this.state.email)
      .then((resp)=>{
        this._getProfile();
      });
    }

    handleDeleteOAuth(){
      this.props.deleteOAuth('google')
      .then((resp)=>{
        this._getProfile();
      });
    }

    render() {
        return (
          <div>
            <Header title={"Profile"} subtitle="Update your user login and authentication."/>
            <Card style={{padding:'25px',width:'90%',margin:'auto'}}>
              <CardTitle title="Password Update" subtitle="Type and confirm new password." />
              <CardText>
                <Input type='text' error={this.state.password !== this.state.passwordVerify?"Verifcation password must match":false} label="Password" name='password' value={this.state.password} onChange={(val)=>{this.handleChange(val,'password')}}  /> 
                <Input type='text' error={this.state.password !== this.state.passwordVerify?"Password must match":false} label="Confirm" name='passwordVerify' value={this.state.passwordVerify} onChange={(val)=>{this.handleChange(val,'passwordVerify')}}  /> 
              </CardText>
              <CardActions>
                <Button alt='Update Password' disabled={Object.keys(this.state.errors.password).length !== 0 || this.state.password === '' || this.state.password !== this.state.passwordVerify} onClick={()=>{this.handleUpdatePassword()}} raised >&nbsp;Update Password</Button>
              </CardActions>
              <CardTitle title="Email Update" subtitle="Update your email" />
              <CardText>
                <Input type='text' error={this.state.errors.email[Object.keys(this.state.errors.email)[0]]||false} label="Email" name='email' value={this.state.email} onChange={(val)=>{this.handleChange(val,'email')}}  />
              </CardText>
              <CardActions>
                <Button alt='Update Email' disabled={Object.keys(this.state.errors.email).length !== 0 || this.state.email == ''} onClick={()=>{this.handleUpdateEmail()}} raised >&nbsp;Update Email</Button> 
              </CardActions>
            </Card>
            

            <Card style={{padding:'25px',width:'90%',margin:'auto'}}>
              <CardTitle avatar="/admin/src/assets/images/avatars/profile.jpg" title="Profile Info" subtitle="Profile info" />
              <CardText style={{fontSize:'1.2em',fontStyle:'italic'}}>
                {this.state.profile.local.email && 
                  <div>{this.state.profile.local.email}</div>
                }
              </CardText>

              <CardTitle title="OAuth" subtitle="Setup google oauth" />
              <CardText style={{fontSize:'1.2em',fontStyle:'italic'}}>
                {this.state.profile.google && this.state.profile.google.id && 
                  <OauthInfo profile={this.state.profile.google} />
                }
              </CardText>
              
              <CardActions>
                <div>
                  {this.state.profile.google && this.state.profile.google.id &&
                    <Button alt='Oauth Delete' onClick={()=>{this.handleDeleteOAuth()}} raised >&nbsp;Delete OAuth</Button> 
                  }
                </div>
                <div>
                  {!this.state.profile.google && 
                    <Button alt='Oauth' onClick={()=>{this.handleAddOAuth()}} raised >&nbsp;Add OAuth</Button>
                  }
                </div>
                 
              </CardActions>
            </Card>
          </div>
        )        
    }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)