//todo break this into containe-componenet
import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import {Button} from 'react-toolbox/lib/button';
import {Input} from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

import Header from '../header';

import { invite } from '../../actions'

const mapStateToProps = (state) => {
  return {             
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    invite: (email,role) => dispatch(invite(email,role))
  }
}

class Invite extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        email:'',
        role:'user',
        roles:[
          {value:'admin',label:'admin'},
          {value:'owner',label:'owner'},
          {value:'user',label:'user'},
        ],
        errors:{}
      }
    }

    handleInvite(){
      this.props.invite(this.state.email,this.state.role)
      .then((resp)=>{
        console.log(resp);
      });
    }

    validateValue(val){
        let errors = this.state.errors;
        if(val.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null){
            errors.regex = 'Has to be a valid email.';
        } else {
            delete errors.regex;
        }

        this.setState({errors});
    }

    handleChange(val,field){
      if(field == 'role'){
        this.setState({role:val});
      } else if(field == 'email') {
        this.validateValue(val);
        this.setState({email:val});
      }
    }

    render() {
        return (
          <div>
            <Header title={"User Invite"} subtitle="Invite a users to edit and update app data."/>
            <Card style={{padding:'25px',width:'90%',margin:'auto'}}>
              <CardText>
                <div style={{fontSize:"2.5em"}}>
                  <FontAwesome name='envelope-open-o' size='4x' style={{padding:'20px',color: 'rgba(75, 75, 175, .9)' }}/>
                </div>
                <Input error={this.state.errors[Object.keys(this.state.errors)[0]]||false} type='text' label="Email" name='email' value={this.state.email} onChange={(val)=>{this.handleChange(val,'email')}}  /> 
                <Dropdown allowBlank={false} auto label="Role" onChange={(val)=>{this.handleChange(val,'role')}} source={this.state.roles} value={this.state.role}/>
              </CardText>
              <CardActions>
                <Button disabled={Object.keys(this.state.errors).length !== 0 && this.state.email !== ''} alt='Invite' onClick={()=>{this.handleInvite()}} raised >&nbsp;Invite</Button>
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
)(Invite)