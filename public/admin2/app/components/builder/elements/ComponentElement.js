import React from 'react';
import Switch from 'react-toolbox/lib/switch';
import Input from 'react-toolbox/lib/input';

class ComponentElement extends React.Component {
    constructor(props){
        super(props);
        let error = {};

        for(let attr in props.formData){
            if(attr!='__t'){
                error[attr] = '';
            }
        }

        this.state={error};
    }

    validate(val,field){
        this.props.handleFormChange(val,field);
        let error = this.state.error;
        error[field] = val.match(/^[0-9]+$/)===null ? 'Must be an integer.' : '';
        this.setState({error});
    }

    render(){
        return(
            <div>
                <Switch checked={this.props.formData.isList}  label={this.props.formData.isList?"List":"Object"} onChange={(val)=>{this.props.handleFormChange(val,'isList')}} />
                {this.props.formData.isList &&
                    <Input type='text' label="Max Size" name='maxSize' error={this.state.error.maxSize} value={this.props.formData.maxSize} onChange={(val)=>{this.validate(val,'maxSize')}} />
                }
            </div>
        )
    }
}

export default ComponentElement;