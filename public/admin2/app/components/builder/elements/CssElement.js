import React from 'react';
import Input from 'react-toolbox/lib/input';
import AceEditor from './AceEditor';

export default class CssElement extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <AceEditor editorChange={(val)=>this.props.handleFormChange(val,'value')} name={this.props.formData.name} value={this.props.formData.value} editorId={this.props.formData._id} options={{theme:'xcode',mode:'text',gutter:true,wrapMode:true,printMargin:false}}/>
            </div>
        )
    }
}