import React from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Checkbox from 'react-toolbox/lib/checkbox';
import Uploader from './Uploader'
import theme from './elements.scss'

export default class ResourceElement extends React.Component {
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

    handleFileValidation(file){
        let size = this.props.formData.maxSize*1000;
        if (this.props.formData.sizeUnit == 'MB') {
            size = size * 1000;
        }

        if (file.size > size) {
            return 'File should be less than ' + this.props.formData.maxSize + this.props.formData.sizeUnit;
        } else {
            return false;
        }
    }

    render(){
        return(
            <div>
                {this.props.formType != 'editor' &&
                    <Checkbox checked={this.props.formData.versioning}  label="Use file Versioning" onChange={(val)=>{this.props.handleFormChange(val,'versioning')}} />
                }
                {this.props.formType != 'editor' &&
                    <Dropdown auto label="Size Units" onChange={(val)=>{this.props.handleFormChange(val,'sizeUnit')}}  source={[{value:'MB',label:"MB"},{value:'KB',label:"KB"}]} value={this.props.formData.sizeUnit} />
                }
                {this.props.formType != 'editor' &&
                    <Input type='text' label="Max Size" name='value' value={this.props.formData.maxSize} onChange={(val)=>{this.props.handleFormChange(val,'maxSize')}}  />
                }
                <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                    {this.props.formType == 'editor' &&
                        <Uploader handleFileValidation={(file)=>{return this.handleFileValidation(file)}} {...this.props.formData} appId={this.props.appId} onUpload={(value)=>{this.props.handleFormChange(value,'value')}} />
                    }
                    <Input className={theme.uploaderInput} type='text' error={this.state.errors[Object.keys(this.state.errors)[0]]||false} label={this.props.formData.name} name='value' value={this.props.formData.value} onChange={(val)=>{this.validateValue(val)}}  />
                </div>
            </div>
        )
    }
}