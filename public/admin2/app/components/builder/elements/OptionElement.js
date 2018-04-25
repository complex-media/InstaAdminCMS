import React from 'react';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import Chip from 'react-toolbox/lib/chip';

export default class OptionElement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newOption:''
        }
    }

    handleAddOption(e,val){
        if (e.key === 'Enter' && this.state.newOption.replace(/ /g,'-') != '') {
            let options = this.props.formData.options;
            options.push(this.state.newOption.replace(/ /g,'-'));
            this.setState({newOption:''});
            this.props.handleFormChange(options,'options');
        }
    }

    handleOnChangeOption(val){
        this.setState({newOption:val});
    }

    handleDeleteOption(option){
        this.props.handleFormChange(this.props.formData.options.filter(opt=>opt!==option),'options');
    }

    render(){

        let modifyOptions = this.props.formData.options.map((val)=>{
            return {value:val,label:val.charAt(0).toUpperCase() + val.slice(1)}
        })
        return(
            <div>
                {this.props.formType != 'editor' &&
                    <Input type='text' label="Add Options" name='value' value={this.state.newOption} onChange={(val)=>this.handleOnChangeOption(val)} onKeyPress={(...val)=>{this.handleAddOption(...val)}}  />
                }
                {this.props.formType != 'editor' &&
                    <div>
                        {this.props.formData.options.map((opt,i)=>{
                            return <Chip key={'option-'+i} deletable onDeleteClick={()=>{this.handleDeleteOption(opt)}}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Chip>;
                        })}
                    </div>
                }
                
                <Dropdown auto label={this.props.formData.name} onChange={(val)=>{this.props.handleFormChange(val,'value')}} source={modifyOptions} value={this.props.formData.value} />
            </div>
        )
    }
}