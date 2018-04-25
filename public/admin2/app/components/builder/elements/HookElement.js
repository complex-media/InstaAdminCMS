import React from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import { Button, IconButton } from 'react-toolbox/lib/button';
import FontAwesome from 'react-fontawesome';
import theme from './elements.scss'
import fetch from 'isomorphic-fetch';

class HookElement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            errors:{},
            requesting:false,
            responseMessage:''
        }
    }

    jsonStringCheck(val,field){
        let errors = this.state.errors;

        delete errors[field];
        try {
          JSON.parse(val)
        } catch (e) {
          let errors = this.state.errors;
          if(e instanceof SyntaxError){
            errors[field] = 'Invalid Json String';
          }
        }

        this.setState({errors})
        this.props.handleFormChange(val,field)
    }

    request(){
        if(Object.keys(this.state.errors).length == 0){
            this.setState({requesting:true});

            let url = this.props.formData.request;
            if ('GET|DELETE'.indexOf(this.props.formData.method) !== -1) {
                url = url + '?'+ this.props.formData.query;
            }
            fetch(url,{
              method: this.props.formData.method,
              headers: JSON.parse(this.props.formData.header),
            })
            .then((resp)=>{
                if(!resp.ok) {
                    this.handleBadResponse(resp);
                } else {
                    resp.json().then((r)=>this.handleSuccessfulResponse(r));
                }
                setTimeout(()=>{
                    this.setState({responseMessage:''});
                }, 5000);

                this.setState({requesting:false});
            })
            
        }
    }

    handleSuccessfulResponse(resp){
        this.setState({responseMessage:'Request was successful'});
        // console.log(resp);
    }
    handleBadResponse(resp){
        this.setState({responseMessage:'Request was unSuccessful'});
        // console.log(resp);
    }

    render(){
        return(
            <div>
                {this.props.formType != 'editor' &&
                <div>
                    <Input type='text' label="Description" multiline rows={3} name='description' value={this.props.formData.description} onChange={(val)=>{this.props.handleFormChange(val,'description')}}  />
                    <Dropdown auto label='Request Method' onChange={(val)=>{this.props.handleFormChange(val,'method')}} source={[{value:'GET',label:'GET'},{value:'POST',label:'POST'},{value:'PUT',label:'PUT'}]} value={this.props.formData.method} />
                    <Input type='text' label="Request Url" name='request' value={this.props.formData.request} onChange={(val)=>{this.props.handleFormChange(val,'request')}}  />
                    <Input type='text' error={this.state.errors.header||false} label="Header" name='header' value={this.props.formData.header} onChange={(val)=>{this.jsonStringCheck(val,'header');}}  />
                    
                    {'GET|DELETE'.indexOf(this.props.formData.method) !== -1 &&
                        <Input type='text' label="Query" name='query' value={this.props.formData.query} onChange={(val)=>{this.props.handleFormChange(val,'query')}}  />
                    }

                    {'POST|PUT'.indexOf(this.props.formData.method) !== -1 &&
                        <Input type='text' error={this.state.errors.body||false} label="Body" name='body' value={this.props.formData.body} onChange={(val)=>{this.jsonStringCheck(val,'body');}}  />
                    }
                </div>
                }
                
                <div className={theme.hookTitle}>{this.props.formData.name}</div>
                <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                    <Button raised className={theme.hookButton} alt="Hook Button" disabled={Object.keys(this.state.errors).length > 0 || this.state.requesting} onClick={()=>this.request()}><FontAwesome className='overwride-ft-rx' name='exchange' /> Request</Button>
                    <div className={theme.hookDescription}>
                        <div>* {this.props.formData.description}</div>
                        {this.state.responseMessage && 
                            <div>** {this.state.responseMessage}</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default HookElement;