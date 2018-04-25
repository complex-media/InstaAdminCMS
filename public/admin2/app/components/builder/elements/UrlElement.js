import React from 'react';
import Input from 'react-toolbox/lib/input';

export default class UrlElement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            errors:{}
        }
    }

    validateValue(val){
        let errors = this.state.errors;
        if(val !='' && val.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \(\)\\?\_\$\#\*\)\~\%\@\(\^\`\!\|\+\~\&\,\%\=\.-]*)*\/?$/) == null){
            errors.number = 'Value has to be a url';
        } else {
            delete errors.number;
        }

        this.setState({errors});

        let newState = { value:val }
        newState.hasError = Object.keys(this.state.errors).length !== 0 ;
        this.props.handleFormChange(newState);
    }

    render(){
        return(
            <div>
                <Input type='text' error={this.state.errors[Object.keys(this.state.errors)[0]]||false} label={this.props.formData.name} name='value' value={this.props.formData.value} onChange={(val)=>{this.validateValue(val)}}  />
            </div>
        )
    }
}
