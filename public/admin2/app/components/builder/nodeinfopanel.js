import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Button, IconButton } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import Dialog from 'react-toolbox/lib/dialog';
import Dropdown from 'react-toolbox/lib/dropdown';

import AppDialogs from '../dialogs/appdialogs'
import theme from '../dialogs/dialog.scss'
import { fetchLibraryComponents, fetchFormElements} from '../../actions'
import ElementInputs from './elements'

import ntheme from './nodeInfoPanel.scss'

class NodeInfoPanel extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      deleteDialogActive:false,
      addDialogActive:false,
      addComponentDialogActive:false,
      updateDialogActive:false,
      showNodeInfo:true,
      nodeData:props.nodeData,
      buttons:{},
      componentLibrary:[],
      elements:{},
      addForm:{},
      elementNameAdd:'component',
      componentToAdd:null

    }
  }

  componentDidMount(){
    this.props.fetchLibraryComponents()
    .then((resp)=>{
      this.setState({componentLibrary:resp.data});
    });
    this.props.fetchFormElements()
    .then((resp)=>{
      let addForm = this.getDefaultAddForm();
      this.setState({elements:Object.assign({},resp.data),addForm});
    });
  }

  getDefaultAddForm(elements){
    return {__t:'component',fieldName:'',name:'',isList:false,maxSize:0,error:'',value:'',inEditor:true};
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.nodeData.isTop) {
      this.setState({buttons:{add:true,library:true}});
    } else if(nextProps.nodeData.__t == 'Component') {
      this.setState({buttons:{add:true,library:true,update:true,delete:true}});
    } else if(nextProps.nodeData.__t && nextProps.nodeData.__t != 'Component'){
      this.setState({buttons:{update:true,delete:true}});
    }

    let nodeData = Object.keys(nextProps.nodeData).reduce(function(p, c) {
        p[c] = nextProps.nodeData[c]||'';
        return p;
    }, {});

    this.setState({nodeData,
      componentToAdd:null,
      elementNameAdd:'component',
      addForm:this.getDefaultAddForm()
    });
  }

  handleUpdateFormChange(val,field){
    let dataObj;
    if (typeof val === 'object' && !Array.isArray(val)) {
      dataObj = val;
    } else {
      dataObj = {}
      dataObj[field] = val;
    }

    let updateForm = this.state.nodeData;
    for(let x in dataObj) {
      updateForm[x] = dataObj[x];
    }

    this.setState({nodeData:updateForm});
  }

  handleAddFormChange(val,field){
    let dataObj;
    if (typeof val === 'object') {
      dataObj = val;
    } else {
      dataObj = {}
      dataObj[field] = val;
    }

    let addForm = this.state.addForm;
    for(let x in dataObj) {
      addForm[x] = dataObj[x];
    }

    this.setState({addForm});
  }

  onChangeAddType(val){
    let elementDefault = this.state.elements[val].default;
    let addForm = this.state.addForm;
    addForm.error={};
    addForm.__t = val;
    for (let attr in elementDefault) {
      if(attr != 'fieldName' && attr != 'name' && attr != 'value'&& attr != 'inEditor'){
        addForm[attr] = elementDefault[attr] === undefined?'':elementDefault[attr];
      }
    }
    this.setState({elementNameAdd:val,addForm});
  }

  render() {
    let componentLibrary = this.state.componentLibrary.map((component,i)=>{
      return (
        <div key={i}>
          <div>{component.title} : {component.description}</div>
            <Button mini alt="Add" onClick={()=>this.setState({componentToAdd:component.appData})}><FontAwesome className='overwride-ft-rx' name='plus'/> Add {component.title}</Button>
        </div>
      )
    });

    let getElementList = (elements)=>{
      return Object.keys(elements).map((k,i)=>{
        return {value:k,label:k};
      });
    }

    return (
      <div id="node-action-window" className={ntheme.nodeActionContainer}>
        <AppDialogs
          active={this.state.deleteDialogActive}
          dialogType='confirm'
          appId = {null}
          closeDialog={()=>this.setState({deleteDialogActive: false})}
          actionDialogCallback={()=>this.props.handleDeleteNode(this.state.nodeData,()=>this.setState({deleteDialogActive: false}))} />

        <Dialog
          theme={theme}
          actions={[
                    { label: "Cancel", onClick: ()=>this.setState({addDialogActive: false})},
                    { label: "Create", disabled:this.state.addForm.hasError, onClick: ()=>this.props.handleAddNode(this.state.nodeData,this.state.addForm,this.state.elements[this.state.elementNameAdd],()=>this.setState({addDialogActive: false}))}
                  ]}
          active={this.state.addDialogActive}
          onEscKeyDown={()=>this.setState({addDialogActive: false})}
          onOverlayClick={()=>this.setState({addDialogActive: false})}
          title='Create new node' >
          <section className={theme.content}>
           <Dropdown auto onChange={(val)=>{this.onChangeAddType(val)}} source={getElementList(this.state.elements)} value={this.state.elementNameAdd} />
            <ElementInputs formType="builderAdd" element={this.state.elementNameAdd} elements={this.state.elements} formData={this.state.addForm} handleFormChange={(val,field,hasErr)=>{this.handleAddFormChange(val,field,hasErr)}}/>
          </section>
        </Dialog>

        <Dialog
          theme={theme}
          actions={[
                    { label: "Cancel", onClick: ()=>this.setState({addComponentDialogActive: false})},
                    { label: "Add", onClick: ()=>this.props.handleAddNodeComponent(this.state.nodeData,this.state.componentToAdd,()=>this.setState({addComponentDialogActive: false}))}
                  ]}
          active={this.state.addComponentDialogActive}
          onEscKeyDown={()=>this.setState({addComponentDialogActive: false,componentToAdd:null})}
          onOverlayClick={()=>this.setState({addComponentDialogActive: false,componentToAdd:null})}
          title='Component Library' >
          <section className={theme.content}>
            <div id='component-library'>
              {componentLibrary}
            </div>
            {this.state.componentToAdd &&
              <div>
                <div>Add this component ?</div>
                <div>{this.state.componentToAdd.title}</div>
                <div>{this.state.componentToAdd.description}</div>
              </div>
            }
          </section>
        </Dialog>

        <Dialog
          theme={theme}
          actions={[
                    { label: "Cancel", onClick: ()=>this.setState({updateDialogActive: false})},
                    { label: "Update", disabled:this.state.nodeData.hasError,onClick: ()=>this.props.handleUpdateNode(this.state.nodeData,this.state.elements[this.state.nodeData.__t.toLowerCase()],()=>this.setState({updateDialogActive: false,nodeData:this.state.nodeData}))}
                  ]}
          active={this.state.updateDialogActive}
          onEscKeyDown={()=>this.setState({updateDialogActive: false})}
          onOverlayClick={()=>this.setState({updateDialogActive: false})}
          title='Update Node Information' >
          <section className={theme.content}>
           <ElementInputs formType="builderUpdate" element={this.state.nodeData.__t} formData={this.state.nodeData} handleFormChange={(val,field,hasErr)=>{this.handleUpdateFormChange(val,field,hasErr)}}/>
          </section>
        </Dialog>

        <div className={ntheme.nodeActionInfo} style={{display:this.props.nodeData.id && this.state.showNodeInfo?'block':'none'}}>
          <div>id:{this.props.nodeData.id}</div>
          <div>name:{this.props.nodeData.name}</div>
          <div>fieldName:{this.props.nodeData.fieldName}</div>
          <div>type:{this.props.nodeData.__t}</div>
          <div>value:{this.props.nodeData.value}</div>
          <div>inEditor:{this.props.nodeData.inEditor?"true":"false"}</div>
        </div>

        <div className={ntheme.nodeActionButtons} style={{display:this.props.nodeData.id?'block':'none'}}>
          <Button theme={ntheme} style={{display:this.state.buttons.add?'inline':'none'}} mini floating alt="Add" inverse={this.state.addDialogActive} onClick={()=>this.setState({addDialogActive:true})}><FontAwesome className='overwride-ft-rx' name='plus'/></Button>
          <Button theme={ntheme} style={{display:this.state.buttons.update?'inline':'none'}} mini floating alt="Update" inverse={this.state.updateDialogActive} onClick={()=>this.setState({updateDialogActive:true})}><FontAwesome className='overwride-ft-rx' name='pencil'/></Button>
          <Button theme={ntheme} style={{display:this.state.buttons.delete?'inline':'none'}} mini floating alt="Delete" inverse={this.state.deleteDialogActive} onClick={()=>this.setState({deleteDialogActive:true})}><FontAwesome className='overwride-ft-rx' name='trash' /></Button>
          <Button theme={ntheme} style={{display:this.state.buttons.library?'inline':'none'}} mini floating alt="Library" inverse={this.state.addComponentDialogActive} onClick={()=>this.setState({addComponentDialogActive:true})}><FontAwesome className='overwride-ft-rx' name='cubes' /></Button>
          <Button theme={ntheme} mini floating alt="Info" inverse={this.state.showNodeInfo} onClick={()=>this.setState({showNodeInfo:!this.state.showNodeInfo})}><FontAwesome className='overwride-ft-rx' name='info' /></Button>
        </div>
      </div>
    )        
  }
}


const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLibraryComponents: (id,cb) => {
      return dispatch(fetchLibraryComponents(id,cb));
    },
    fetchFormElements: (id,cb) => {
      return dispatch(fetchFormElements(id,cb));
    },
  }
}
//connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeInfoPanel)