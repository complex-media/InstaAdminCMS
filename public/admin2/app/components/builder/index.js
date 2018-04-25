import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { BrowserRouter as Router, Route, Link as RouterLink} from 'react-router-dom';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import { Button, IconButton } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import Dialog from 'react-toolbox/lib/dialog';
import Dropdown from 'react-toolbox/lib/dropdown';
import Switch from 'react-toolbox/lib/switch';
import Header from '../header';
import theme from './builder.scss'

import AppDialogs from '../dialogs/appdialogs'
import InfoDialog from '../dialogs/InfoDialog'

import { fetchApplication,
  publishApplication,
  updateApplication, 
  fetchApplicationProto, 
  updateApplicationMeta, 
  duplicateElement, 
  fetchLibraryComponents, 
  fetchFormElements , 
  deleteElement , 
  addElements , 
  updateElement } from '../../actions'


import NodeInfoPanel from './nodeinfopanel'
import SchemaBuilder from './schemaBuilder'

const mapStateToProps = (state) => {
  return {
    sConfig:state.sConfig
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchApplicationProto: (id,resourceType,cb) => {
      return dispatch(fetchApplicationProto(id,resourceType.toLowerCase()+"s",cb));
    },
    toggleUnlock:(id,resourceType,form,cb) => {
      return dispatch(updateApplicationMeta(id,resourceType.toLowerCase()+"s",form,cb))
    },
    duplicateNode:(id,resourceType,dupId,targetId,cb)=>{
      return dispatch(duplicateElement(id,resourceType.toLowerCase()+"s",dupId,targetId,cb));
    },
    deleteElement:(id,resourceType,nodeId,cb)=>{
      return dispatch(deleteElement(id,resourceType.toLowerCase()+"s",nodeId,cb));
    }, 
    addElements:(id,resourceType,elementId,structure,cb)=>{
      return dispatch(addElements(id,resourceType.toLowerCase()+"s",elementId,structure,cb));
    },
    updateElement:(id,resourceType,elementId,form,cb)=>{
      return dispatch(updateElement(id,resourceType.toLowerCase()+"s",elementId,form,cb));
    }
  }
}


class Builder extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      infoDialogActive:false,
      appId:props.match.params.appId,
      title:'App',
      appData:[],
      confirmLockDialogsActive:false,
      confirmLockDialogType:null,
      selectedNodeId:null,
      metaData:null,
      nodeData:{
        id:null,
        _id:null,
        __t:null,
        name:null,
        fieldName:null,
        value:null,
        inEditor:true,
        createdAt:null,
      }
    }
  }

  componentWillMount(){
    this.props.fetchApplicationProto(this.state.appId,this.props.resourceType)
    .then((resp)=>{
      this.setNodeData(resp);
    });
  }
  c

  setNodeData(resp){
    this.setState({
      appData:resp.data.appData,
      title:resp.data.title,
      schemaLock:resp.data.schemaLock,
      dataLock:resp.data.dataLock,
      metaData:resp.data.data
    });
  }

  toggleUnlocks(){
    let form = {};
    form[this.state.confirmLockDialogType] = !this.state[this.state.confirmLockDialogType];
    this.props.toggleUnlock(this.state.appId,this.props.resourceType,form)
    .then(()=>{
      this.setState({confirmLockDialogsActive: false});
      this.setState(form);
    });
  }

  duplicateNode(dupNode,targetNode){
    this.props.duplicateNode(this.state.appId,this.props.resourceType,dupNode.id,targetNode.id)
    .then((resp)=>{
      this.props.fetchApplicationProto(this.state.appId,this.props.resourceType)
      .then((resp)=>{
        this.setNodeData(resp);
      });
    })
  }

  reRenderNodeWindow(node){

  }

  onNodeClick(node,e){
    this.setState({nodeData:node.data});
  }

  handleDeleteNode(node,cb){
    this.props.deleteElement(this.state.appId,this.props.resourceType, node.id)
    .then((resp)=>{
      this.setState({selectedNodeId:null});
      this.props.fetchApplicationProto(this.state.appId,this.props.resourceType)
      .then((resp)=>{
        this.setNodeData(resp);
        cb();
      });
    });
  }

  handleUpdateNode(form,element,cb){
    let keys = Object.keys(element.default).concat(['fieldName','name','inEditor','value','__t','_id']);
    for(let x in form ){
      if(keys.indexOf(x) === -1) {
        delete form[x];
      }
    }
    form.__t = form.__t.charAt(0).toUpperCase() + form.__t.slice(1);

    this.props.updateElement(this.state.appId,this.props.resourceType,form._id,form)
    .then((resp)=>{
      return this.props.fetchApplicationProto(this.state.appId,this.props.resourceType)
    })
    .then((resp)=>{
        this.setNodeData(resp);
        this.setState({nodeData:form})
        cb();
    });
  }

  handleAddNode(node,form,element,cb){
    let keys = Object.keys(element.default).concat(['fieldName','name','inEditor','value','__t']);
    for(let x in form ){
      if(keys.indexOf(x) === -1) {
        delete form[x];
      }
    }
    form.__t = form.__t.charAt(0).toUpperCase() + form.__t.slice(1);

    this.props.addElements(this.state.appId,this.props.resourceType,node.id,form)
    .then((resp)=>{
      this.props.fetchApplicationProto(this.state.appId,this.props.resourceType)
      .then((resp)=>{
        this.setNodeData(resp);
        cb();
      });
    });
  }

  handleAddNodeComponent(node,component,cb){
    this.props.addElements(this.state.appId,this.props.resourceType,node.id,component)
    .then((resp)=>{
      this.props.fetchApplicationProto(this.state.appId,this.props.resourceType)
      .then((resp)=>{
        this.setNodeData(resp);
        cb();
      });
    })
  }



  render() {

    let buttons = [];

    buttons.push({
      title:!this.state.dataLock?'Lock Data':'Unlock Data',
      action: ()=>this.setState({confirmLockDialogsActive: true, confirmLockDialogType:'dataLock'}),
      icon: <FontAwesome name={this.state.dataLock?'lock':'unlock'}/>,
      disabled:false
    });

    buttons.push({
      title:!this.state.schemaLock?'Lock Schema':'Unlock Schema',
      action: ()=>this.setState({confirmLockDialogsActive: true, confirmLockDialogType:'schemaLock'}),
      icon: <FontAwesome name={this.state.schemaLock?'lock':'unlock'}/>,
      disabled:false
    });

    buttons.push({
      title:"Info",
      action: ()=>{this.setState({infoDialogActive: true})},
      icon: <FontAwesome name='info-circle'/>,
      disabled:false
    });

    buttons.push({
      title:"Editor",
      action: ()=>{this.props.history.push(this.props.sConfig.baseAdminPath+"/"+this.props.resourceType.toLowerCase()+"s/"+this.state.appId+"/editor")},
      icon: <FontAwesome name='pencil-square-o'/>,
      disabled:false
    });

    return (
      <div>
        {this.props.resourceType == 'Application' &&
          <InfoDialog active={this.state.infoDialogActive} appId={this.state.appId} closeDialog={()=>this.setState({infoDialogActive: false})}/>
        }
        <AppDialogs
          active={this.state.confirmLockDialogsActive}
          dialogType='confirm'
          appId = {this.state.appId}
          closeDialog={()=>this.setState({confirmLockDialogsActive: false})}
          actionDialogCallback={this.toggleUnlocks.bind(this)} />


        <Header title={"Schema Builder - "+this.state.title} subtitle="Design your data endpoint" buttons={buttons}/>      
        <div>
          <SchemaBuilder 
            handleSetSelectedNode={(id)=>{this.setState({selectedNodeId:id})}}
            handleOnNodeDrop={(...args)=>this.duplicateNode(...args)} 
            handleOnNodeClick={(...args)=>this.onNodeClick(...args)}
            handleOnPan={(...args)=>this.reRenderNodeWindow(...args)}
            selectedNodeId={this.state.selectedNodeId}
            metaData={this.state.metaData} 
            appData={this.state.appData} />
          <NodeInfoPanel nodeData={this.state.nodeData} 
            nodeInfoWindow={this.state.nodeInfoWindow}
            handleDeleteNode={(...args)=>this.handleDeleteNode(...args)}
            handleUpdateNode={(...args)=>this.handleUpdateNode(...args)}
            handleAddNodeComponent={(...args)=>this.handleAddNodeComponent(...args)}
            handleAddNode={(...args)=>this.handleAddNode(...args)}/>
        </div>
        
        
      </div>
    )        
  }
}

//connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Builder)