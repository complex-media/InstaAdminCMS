import React from 'react';
import Input from 'react-toolbox/lib/input';
import Checkbox from 'react-toolbox/lib/checkbox';
import TextElement from './TextElement';
import ComponentElement from './ComponentElement';
import ContentElement from './ContentElement';
import CssElement from './CssElement';
import DateElement from './DateElement';
import DatetimeElement from './DatetimeElement';
import HtmlElement from './HtmlElement';
import ImageElement from './ImageElement';
import MarkdownElement from './MarkdownElement';
import NumberElement from './NumberElement';
import OptionElement from './OptionElement';
import ResourceElement from './ResourceElement';
import UrlElement from './UrlElement';
import HookElement from './HookElement';

const Elements = {
  "text":TextElement,
  "component":ComponentElement,
  "content":ContentElement,
  "css":CssElement,
  "date":DateElement,
  "datetime":DatetimeElement,
  "html":HtmlElement,
  "image":ImageElement,
  "markdown":MarkdownElement,
  "number":NumberElement,
  "option":OptionElement,
  "resource":ResourceElement,
  "url":UrlElement,
  "hook":HookElement,
} 

const OverrideInput = (props) => {
  return(props.overrideFieldname 
    ?<Input required type='text' label='Field Name' name='name' value={props.formData.fieldName} onChange={(val)=>{props.handleFormChange(val,'fieldName')}}  maxLength={51} />
    : null
  )
}
export default class ElementInputs extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          overrideFieldname:true
        }
    }

    handleOverrideFieldname(val){
      this.setState({overrideFieldname:val});
      if(val===true){
        this.props.handleFormChange('','fieldName');
      }
    }

    render(){
        let VarInputs = Elements[this.props.element.toLowerCase()] || null;
        if(VarInputs){
            return(
              <div style={{width:'100%'}}>
                {this.props.formType.indexOf('builder') !== -1 &&
                  <div>
                    <Input required type='text' label='Name' name='name' value={this.props.formData.name} onChange={(val)=>{this.props.handleFormChange(val,'name')}} maxLength={50} />
                    <OverrideInput {...this.props} overrideFieldname={this.state.overrideFieldname}/>
                    <Checkbox checked={this.props.formData.inEditor}  label="Show in Editor" onChange={(val)=>{this.props.handleFormChange(val,'inEditor')}} />
                    {this.props.formType == 'builderAdd' ?<Checkbox checked={this.state.overrideFieldname}  label="Override default field name" onChange={(val)=>{this.handleOverrideFieldname(val)}} />:null}
                  </div>
                }
                <VarInputs formType={this.props.formType} formData={this.props.formData} appId={this.props.appId} handleFormChange={this.props.handleFormChange}/>
              </div>
            )
        } else {
            return (
              <div>This element does not exist yet.</div>
            )
        }
    }
}