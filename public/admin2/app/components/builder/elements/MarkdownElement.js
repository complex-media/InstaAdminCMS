import React from 'react';
import Input from 'react-toolbox/lib/input';

export default class MarkdownElement extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <Input type='text' label={this.props.formData.name} name='value' value={this.props.formData.value} onChange={(val)=>{this.props.handleFormChange(val,'value')}}  />
            </div>
        )
    }
}