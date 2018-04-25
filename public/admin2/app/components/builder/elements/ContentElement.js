import React from 'react';
import Input from 'react-toolbox/lib/input';
import AceEditor from './AceEditor';

export default class ContentElement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            errors:{}
        }
    }

    handleFormChange(val,field){
       
        this.props.handleFormChange(val,field);
        let errors = this.state.errors;

        if(this.props.formData.maxLength && this.props.formData.maxLength < this.props.formData.value.length){
            errors.maxLength = 'Value cannot be more than ' + this.props.formData.maxLength + ' characters.';
            this.props.handleFormChange(true,'hasError');
        } else {
            delete errors.maxLength;
            this.props.handleFormChange(false,'hasError');
        }
        this.setState({errors});
    }

    render(){
        
        return(
            <div>
                <AceEditor editorChange={(val)=>this.handleFormChange(val,'value')} name={this.props.formData.name} value={this.props.formData.value} editorId={this.props.formData._id} options={{theme:'xcode',mode:'text',gutter:true,wrapMode:true,printMargin:false}}/>
                <span style={{color:'red'}}>{this.state.errors[Object.keys(this.state.errors)[0]]||''}</span>

                {this.props.formType != 'editor' &&
                   <Input type='text' label="Max Length" name='M' value={this.props.formData.maxLength} onChange={(val)=>{this.handleFormChange(val,'maxLength')}}  /> 
                }

                
            </div>
        )
    }
}