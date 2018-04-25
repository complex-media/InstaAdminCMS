import React from 'react';
import Input from 'react-toolbox/lib/input';

export default class NumberElement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            errors:{}
        }
    }

    validateValue(val){
        let errors = this.state.errors;
        if(val.match(/^[0-9]+([,.][0-9]+)?$/) == null){
            errors.number = 'Value has to be a number';
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