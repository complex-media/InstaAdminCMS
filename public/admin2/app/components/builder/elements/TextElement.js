import React from 'react';
import Input from 'react-toolbox/lib/input';

class TextElement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            errors:{}
        }
    }

    validateValue(val){
        let errors = this.state.errors;
        if(this.props.formData.maxLength && this.props.formData.maxLength < val.length){
            errors.maxLength = 'Value cannot be more than ' + this.props.formData.maxLength + ' characters.';
        } else {
            delete errors.maxLength;
        }

        this.setState({errors});
        
        let newState = { value:val }
        newState.hasError = Object.keys(this.state.errors).length !== 0 ;
        this.props.handleFormChange(newState);

    }

    render(){
        return(
            <div>
                {this.props.formType != 'editor' &&
                    <Input type='number' label="Max Length" name='value' value={this.props.formData.maxLength} onChange={(val)=>{this.props.handleFormChange(val,'maxLength')}}  />
                }
                <Input type='text' error={this.state.errors[Object.keys(this.state.errors)[0]]||false} label={this.props.formData.name} name='value' value={this.props.formData.value} onChange={(val)=>{this.validateValue(val)}}  />
            </div>
        )
    }
}

export default TextElement;