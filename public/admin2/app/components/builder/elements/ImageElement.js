import React from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Checkbox from 'react-toolbox/lib/checkbox';
import Dialog from 'react-toolbox/lib/dialog';
import Chip from 'react-toolbox/lib/chip';
import Avatar from 'react-toolbox/lib/avatar';
import FontAwesome from 'react-fontawesome';
import Uploader from './Uploader'

export default class ImageElement extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            addFormat:'',
            allowedFormat:['jpg','bmp','jpeg','png','gif'],
            errors:{}
        }
    }

    validateValue(val){
        let errors = this.state.errors;
        if(val.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \(\)\\?\_\$\#\*\)\~\%\@\(\^\`\!\|\+\~\&\,\%\=\.-]*)*\/?$/) == null && val !=''){
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
        console.log(file,this.props.formData.allowed);
        //Test Type
        let formats = this.props.formData.allowed.slice();
        if(formats.indexOf('jpeg') !== -1 || formats.indexOf('jpg') !== -1){
            formats.unshift(['jpeg','jpg']);
        }

        if(formats.indexOf(file.type.replace('image/','')) == -1){
            return 'Format must be '+ this.props.formData.allowed.join(', ')+'.';
        }
        //Test Dimnensions
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        let width, height;
        
        img.onload = function () {
            width  =  this.width;
            height =  this.height;
        }
        img.src = _URL.createObjectURL(file);


        //Test Size
        let size = this.props.formData.maxSize*1000;
        if (this.props.formData.sizeUnit == 'MB') {
            size = size * 1000;
        }

        if (file.size > size) {
            return 'File should be less than ' + this.props.formData.maxSize + this.props.formData.sizeUnit;
        } 

        return false
    }

    handleAllowedFormat(e,val){
        if (e.key === 'Enter'){
            if (this.state.allowedFormat.indexOf(this.state.addFormat) === -1){
                return;
            }

            if(this.props.formData.allowed.indexOf(this.state.addFormat) === -1) {
                let allowed = this.props.formData.allowed;
                allowed.push(this.state.addFormat);
                this.props.handleFormChange(allowed,'allowed');
                this.setState({addFormat:''});
            }
        }
    }

    handleDeleteAllowed(val) {
        this.props.handleFormChange(this.props.formData.allowed.filter((v)=>v!=val),'allowed');
    }

    render(){
        return(
            <div>
                {this.props.formType != 'editor' &&
                    <Dropdown auto label="Size Units" onChange={(val)=>{this.props.handleFormChange(val,'sizeUnit')}}  source={[{value:'MB',label:"MB"},{value:'KB',label:"KB"}]} value={this.props.formData.sizeUnit} />
                }
                {this.props.formType != 'editor' &&
                    <Input type='text' label="Max Height" name='maxHeight' value={this.props.formData.maxHeight||''} onChange={(val)=>{this.props.handleFormChange(val,'maxHeight')}}  />
                }
                {this.props.formType != 'editor' &&
                    <Input type='text' label="Max Width" name='maxWidth' value={this.props.formData.maxWidth||''} onChange={(val)=>{this.props.handleFormChange(val,'maxWidth')}}  />
                }
    
                {this.props.formType != 'editor' &&
                    <div>
                        {this.props.formData.allowed.map((opt)=>{
                            return <Chip deletable onDeleteClick={()=>{this.handleDeleteAllowed(opt)}}>{opt}</Chip>;
                        })}
                    </div>
                }
                
                {this.props.formType != 'editor' &&
                    <Input type='text' label="Allowed Formats" name='allowedFormat' value={this.state.addFormat} onChange={(val)=>{this.setState({addFormat:val.replace(/ /g,'')})}} onKeyPress={(...val)=>{this.handleAllowedFormat(...val)}}/>
                }
                {this.props.formType != 'editor' &&
                    <Input type='text' label="Max Size" name='maxSize' value={this.props.formData.maxSize} onChange={(val)=>{this.props.handleFormChange(val,'maxSize')}}  />
                }
                {this.props.formType != 'editor' &&
                    <Checkbox checked={this.props.formData.versioning}  label="Use file Versioning" onChange={(val)=>{this.props.handleFormChange(val,'versioning')}} />
                }
                <Input type='text' error={this.state.errors[Object.keys(this.state.errors)[0]]||false} label={this.props.formData.name} name='value' value={this.props.formData.value} onChange={(val)=>{this.validateValue(val)}}  />
                {this.props.formType == 'editor' &&
                    <Uploader handleFileValidation={(file)=>{return this.handleFileValidation(file)}} {...this.props.formData} appId={this.props.appId} onUpload={(value)=>{this.props.handleFormChange(value,'value')}} />
                }
            </div>
        )
    }
}