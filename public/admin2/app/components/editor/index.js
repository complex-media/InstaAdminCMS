//todo break this into containe-componenet
import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import FontIcon from 'react-toolbox/lib/font_icon';
import { Link as RouterLink} from 'react-router-dom';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import { Button, IconButton } from 'react-toolbox/lib/button';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import ElementInputs from '../builder/elements';
import Chip from 'react-toolbox/lib/chip'; 
import Avatar from 'react-toolbox/lib/avatar';
import theme from './editor.scss'
import {SortableContainer, SortableHandle, SortableElement, arrayMove} from 'react-sortable-hoc';
import Header from '../header';
import SchemaNavigation from './schemaNavigation.js'
import ConfirmDialog from '../dialogs/ConfirmDialog'

import webSocketService from '../../webSocketService';
import { fetchResource , publishApplication, updateResource, addToList, removeFromList } from '../../actions'

const mapStateToProps = (state) => {
  return {
    sConfig:state.sConfig             
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchResource: (id,resourceType) => {
      return dispatch(fetchResource(id,resourceType));
    },
    publishApplication: (id)=>{
      return dispatch(publishApplication(id));
    },
    updateResource:(id,resourceType,nodeId,update) =>{
      return dispatch(updateResource(id,resourceType,nodeId,update));
    },
    addToList:(id,resourceType,nodeId,index)=> {
      return dispatch(addToList(id,resourceType,nodeId,index));
    },
    removeFromList:(id,resourceType,nodeId,index)=> {
      return dispatch(removeFromList(id,resourceType,nodeId,index));
    }
  }
}

const dfFind = (nodeList,subNodeId) =>{
  var returnNode = null;
  for (var i = 0; i < nodeList.length; i++) {
    if(nodeList[i].__t == 'Component') {
      if(nodeList[i]._id == subNodeId){
        returnNode = nodeList[i];
        break;
      } else{
        returnNode = dfFind(nodeList[i].children,subNodeId);
        if(returnNode){
          break;
        }
      }
    }
  }
  return returnNode;
}

const ElementInput = ({node,appId,handleFormChange}) => {
  return (
      <div className={theme.elementNode}>
          <ElementInputs formType="editor" appId={appId} element={node.__t.toLowerCase()} elements={{}} formData={node} handleFormChange={handleFormChange}/>
      </div>
  );
}

const ElementComponent = ({node}) => {
    let titleNode = node.children.filter((sNode)=>sNode.fieldName == 'title');
    let compName = titleNode[0]? titleNode[0].value : node.name; 
    return(<div className={theme.compListNode}>{node.isList?"":""}{compName.charAt(0).toUpperCase() + compName.slice(1)}</div>);
}

const DragHandle = SortableHandle(() => <div className={theme.dragHandle}><FontIcon value='drag_handle' /></div>);
const NextIcon = (props) =>{
  if(props.useRouter) {
    return (<RouterLink onClick={()=>props.handleComponentClick()} to={props.sConfig.baseAdminPath+"/"+props.resourceType+"/"+props.appId+"/editor/"+(props.node._id||'')}><IconButton><FontAwesome name='chevron-right'/></IconButton></RouterLink>)
  } else {
    return (<IconButton onClick={()=>props.handleComponentClick(props.node,props.pIndex)}> <FontAwesome name='chevron-right'/></IconButton>)
  }
}

const SortableItem = SortableElement(({node,pIndex,cIndex,appId,isList,handleFormChange,handleDeleteListNode,resourceType,resourceRole,sConfig,handleComponentClick, isSelected, useRouter}) =>{
  return(
    <li className={theme.sortLi}>
      
      <div key={node._id} className={theme.nodeContainer} style={{display:node.inEditor || ('admin|owner|developer'.indexOf(resourceRole) !== -1 || InstaAdminConfig.role=='admin')?'block':'none'}}>
        {node.__t == 'Component' &&
          <div className={isSelected?theme.nodeContainterTitleSelected:theme.nodeContainterTitle}>
            <div className={theme.nodeContainterTitleLeft}>
              <DragHandle/>
              <ElementComponent node={node}/>
            </div>
            <div className={theme.nodeContainterTitleLeft}>
              <IconButton  alt='delete' style={{display:isList?'inline-block':'none'}} onClick={()=>handleDeleteListNode(pIndex)}><FontAwesome name='trash'/></IconButton>
              <NextIcon {...{node,handleComponentClick,sConfig,useRouter,appId,resourceType,pIndex}} />
            </div>
          </div>
        }
        {node.__t !== 'Component' &&
          <div className={node._updated || (node._newData && node._newData != node.value)?theme.nodeContainterInputAlert:theme.nodeContainterInput} style={{display:node.__t !== 'Component'?"flex":'none'}}>
              <DragHandle/>
              <ElementInput node={node} appId={appId} handleFormChange={(val,field)=>handleFormChange(node,pIndex,cIndex,val,field)}/>
              <div className={theme.containerMsg}>
                {(node._updated || (node._newData && node._newData != node.value)) && 
                  <IconMenu icon={<FontAwesome style={{color: 'red',fontSize:'1.5em'}} name='exclamation'/>} position='auto' menuRipple>
                    {node._newData && node._newData != node.value &&
                    <div>
                      <MenuItem value='help' disabled={true} icon='' caption='* Another user has updated this field' />
                      <MenuItem value='sync' icon='sync' caption='Use New Data' onClick={()=>handleFormChange(node,pIndex,cIndex,node._newData,'value')}/>
                      <MenuDivider />
                    </div>}
                    <MenuItem value='help' disabled={true} icon='' caption='* This field has been updated' />
                  </IconMenu>
                }
              </div>
          </div>
        }
      </div>
    </li>
)});
 
const SortableList = SortableContainer(({items,parentIndex,isList,appId,handleFormChange,handleDeleteListNode,resourceType,resourceRole,sConfig,handleComponentClick,selectedNodeId,useRouter}) => {
  return (
    <ul className={theme.sortUl}>
      {items.map((node,index)=>{
        if(index == 0 && isList){
          return null;
        }
        let pIndex = index;
        let cIndex = null;
        if(parentIndex!==null){
          pIndex = parentIndex;
          cIndex = index;
        }
        return (
          <SortableItem 
            key={`item-${index}`}
            isSelected={node._id==selectedNodeId}
            {...{
              isList,
              index,
              pIndex,
              cIndex,
              node,
              appId,
              handleFormChange,
              handleDeleteListNode,
              resourceType,
              resourceRole,
              sConfig,
              handleComponentClick,
              useRouter
            }}/>
        )
      })}
    </ul>
  );
});
class Editor extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        appId:props.match.params.appId,
        nodeId:props.match.params.nodeId||null,
        isList:false,
        prototypeNode:null,
        hasError:true,
        title:'Editorz',
        nodeData:[],
        rawAppData:[],
        selectedNodeData:[],
        selectedNodeisList:false,
        selectedNodeId:null,
        selectedNodeName:null,
        selectedNodeIndex:null,
        updated:'NONE',//NONE//PARENT//CHILD//BOTH
        resourceRole:null,
        confirmDialog:false,
        deleteAction:null
      }
    }

    componentWillMount(){
      this.props.fetchResource(this.state.appId,this.props.match.params.resourceType)
      .then((resp)=>{
        this._setNodeData(resp);
      });
    }

    updatePageData(data){
      if(this.state.nodeId){
          let subNode = dfFind(data.data.appData,this.state.nodeId);
          let selectedNodeData = [];
          if(this.state.selectedNodeData.length > 0){
            selectedNodeData = this._diffMarker(this.state.selectedNodeData,subNode.children[this.state.selectedNodeIndex].children);
          }
          this.setState({
            rawAppData:data.data.appData,
            nodeData:this._diffMarker(this.state.nodeData,subNode.children),
            hasError:this._hasError(subNode.children),
            selectedNodeData,
            updated:'NONE'
          });
        } else {
          let selectedNodeData = [];
          if(this.state.selectedNodeData.length > 0){
            selectedNodeData = this._diffMarker(this.state.selectedNodeData,data.data.appData[this.state.selectedNodeIndex].children);
          }
          this.setState({rawAppData:data.data.appData,nodeData:this._diffMarker(this.state.nodeData,data.data.appData),hasError:this._hasError(data.data.appData),selectedNodeData,updated:'NONE'});
        }
    }

    componentDidMount(){
      webSocketService.subscribe(this.state.appId,(data)=>{
        console.log('Schema update. New data incoming...');
        this.updatePageData(data);
      })
    }

    //compares old nodeData vs newData and marks them 
    _diffMarker(oldData,newData) {

      //get updating data
      //first second level for editor and open if the input was expanded
      let pendingElements = {'first':{},'second':{},'open':{}};
      for(let i = 0 ; i < oldData.length; i++){
          if(oldData[i].showChildren){
              pendingElements.open[oldData[i]._id] = true;
          }
          if(oldData[i]._updated == true) {
              pendingElements.first[oldData[i]._id] = oldData[i].value;
          }

          if(oldData[i].__t == 'Component') {
              for(let j = 0 ; j < oldData[i].children.length; j++){
                  if(oldData[i].children[j]._updated == true) {
                      pendingElements.second[oldData[i].children[j]._id] = oldData[i].children[j].value;
                  }
              }
          }
      }

      for(let i = 0 ; i < newData.length; i++){
          //check parent level for updated data
          if(pendingElements.first[newData[i]._id] && pendingElements.first[newData[i]._id] !== newData[i].value) {
              newData[i]._newData = newData[i].value;
              newData[i].value = pendingElements.first[newData[i]._id];
              newData[i]._updated = true;
          }
          if(pendingElements.open[newData[i]._id]) {
              newData[i].showChildren = true;
          }

          //check child level for updated data
          if(newData[i].__t == 'Component') {
              for(let j = 0 ; j < newData[i].children.length; j++){
                  if(pendingElements.second[newData[i].children[j]._id] && pendingElements.second[newData[i].children[j]._id] !== newData[i].children[j].value) {
                      newData[i].children[j]._newData = newData[i].children[j].value;
                      newData[i].children[j].value = pendingElements.second[newData[i].children[j]._id];
                      newData[i].children[j]._updated = true;
                  }
              }
          }
      }

      return newData;
    }

    componentWillUnmount(){
      webSocketService.unsubscribe(this.state.appId);
    }

    componentWillReceiveProps(props){
      this.setState({nodeId:props.match.params.nodeId||null});
      this.props.fetchResource(this.state.appId,this.props.match.params.resourceType)
      .then((resp)=>{
        this._setNodeData(resp);
      });
    }

    _setNodeData(resp){
      if(this.state.nodeId){
        let subNode = dfFind(resp.data.appData,this.state.nodeId);
        this.setState({
          rawAppData:resp.data.appData,
          nodeData:subNode.children,
          isList:subNode.isList,
          prototypeNode:subNode.isList?subNode.children[0]:null,
          hasError:this._hasError(subNode.children),
          resourceRole:resp.data.resourceRole,
          title:resp.data.title
        });

      } else {
        this.setState({rawAppData:resp.data.appData,nodeData:resp.data.appData,hasError:this._hasError(resp.data.appData),resourceRole:resp.data.resourceRole,title:resp.data.title});
      }
    }

    _hasError(nodeData){
      let errors = [] 
      nodeData.forEach((node,i)=>{
        errors.push(node.hasError);
        if(node.__t ==  'Component') {
          node.children.forEach((cNode,j)=>{
            errors.push(cNode.hasError);
          });
        }
      })
 
      return !errors.every(x=>x!==true)
    }

    handlePublish = ()=>{
      this.props.publishApplication(this.state.appId,this.props.match.params.resourceType)
      .then((resp)=>{
      });
    }

    handleSave = ()=>{
      
      let savePromise
      if(this.state.updated=='PARENT'){
        savePromise = this.props.updateResource(this.state.appId,this.props.match.params.resourceType,this.state.nodeId || this.state.appId,this.state.nodeData)
      }else if(this.state.updated=='CHILD'){
        savePromise = this.props.updateResource(this.state.appId,this.props.match.params.resourceType,this.state.selectedNodeId,this.state.selectedNodeData)
      } else if(this.state.updated=='BOTH'){
        savePromise = this.props.updateResource(this.state.appId,this.props.match.params.resourceType,this.state.nodeId || this.state.appId,this.state.nodeData)
      }

      // Should use Websocketsl
      if(savePromise!=null){
        savePromise.then((resp)=>{
          this.props.fetchResource(this.state.appId,this.props.match.params.resourceType)
          .then((resp)=>{
            this.updatePageData(resp);
          });
        })
      }
    }

    handleFormChange = (node, pIndex, cIndex, value, field) => {
      let dataObj;
      if (typeof value === 'object') {
        dataObj = value;
      } else {
        dataObj = {}
        dataObj[field] = value;
      }

      let nodeData = JSON.parse(JSON.stringify(this.state.nodeData));
      let selectedNodeData = this.state.selectedNodeData;
      let updated = this.state.updated;
      //changing child form data
      if (cIndex != null ) {

        for(let x in dataObj) {
          nodeData[pIndex].children[cIndex][x] = dataObj[x];
          if(x == 'value' && node._newData != dataObj[x] ) {
            nodeData[pIndex].children[cIndex]._updated = true;
          } else if(x == 'value' && node._newData == dataObj[x]){
            nodeData[pIndex].children[cIndex]._updated = false;
            delete nodeData[pIndex].children[cIndex]._newData;
          }
        }
        selectedNodeData = nodeData[pIndex].children;
        updated = updated == 'PARENT' || updated == 'BOTH' ?'BOTH':'CHILD'; 
      } else {
        for(let x in dataObj) {
          nodeData[pIndex][x] = dataObj[x];
          if(x == 'value' && node._newData != dataObj[x]) {
            nodeData[pIndex]._updated = true;
          } else if(x == 'value' && node._newData == dataObj[x]){
            nodeData[pIndex]._updated = false;
            delete nodeData[pIndex]._newData;
          }
        }
        updated = updated == 'CHILD' || updated == 'BOTH' ?'BOTH':'PARENT';
      }
      let hasError = this._hasError(nodeData);
      this.setState({nodeData:nodeData,hasError,selectedNodeData,updated});
    }

    handleOnSortEnd({oldIndex, newIndex},e,useSelectedNodeData){
      let updated = this.state.updated;
      if(useSelectedNodeData){
        updated = updated == 'PARENT' || updated == 'BOTH' ?'BOTH':'CHILD'; 
        this.setState({
          selectedNodeData: arrayMove(this.state.selectedNodeData, oldIndex, newIndex),updated
        });
      } else{
        let selectedNodeIndex = this.state.selectedNodeIndex;
        if(this.state.selectedNodeIndex < oldIndex & this.state.selectedNodeIndex >= newIndex){
          //Item placed before selectedNode
          selectedNodeIndex++;
        } else if (this.state.selectedNodeIndex > oldIndex & this.state.selectedNodeIndex <= newIndex){
          //Item taken from before  selectedNode
          selectedNodeIndex--;
        } else if (this.state.selectedNodeIndex == oldIndex){
          selectedNodeIndex = newIndex
          //Item taken is selectedNode
        }

        updated = updated == 'CHILD' || updated == 'BOTH' ?'BOTH':'PARENT'; 
        this.setState({
          nodeData: arrayMove(this.state.nodeData, oldIndex, newIndex),
          updated,
          selectedNodeIndex
        });
      }
    };

    handleAddPrototype(){
      if(!this.state.isList)
        return;
      this.props.addToList(this.state.appId,this.props.match.params.resourceType,this.state.nodeId,0)
      .then((resp)=>{
        this.props.fetchResource(this.state.appId,this.props.match.params.resourceType)
        .then((resp)=>{
          this._setNodeData(resp);
          this.setState({selectedNodeData:[],selectedNodeId:null})
        });
      });
    }

    openDeleteDialog(index){
      if(!this.state.isList)
        return;
      this.setState({
        confirmDialog:true,
        deleteAction:this.deleteNode(index)
      });
    }
    deleteNode(index){
      return ()=>{
        this.props.removeFromList(this.state.appId,this.props.match.params.resourceType,this.state.nodeId,index)
        .then((resp)=>{
          return this.props.fetchResource(this.state.appId,this.props.match.params.resourceType)
        })
        .then((resp)=>{
          this._setNodeData(resp);
          this.setState({selectedNodeData:[],selectedNodeId:null,confirmDialog:false,deleteAction:null})
        });
      };
    }

    handleComponentClick(node=[],pIndex=null){
      let selectedNodeisList = (node.__t == 'Component' && node.isList);
      this.setState({selectedNodeData:node.children,selectedNodeIndex:pIndex,selectedNodeId:node._id,selectedNodeName:node.name.charAt(0).toUpperCase() + node.name.slice(1),selectedNodeisList})
    }

    render() {
        if('applications|templates|components'.indexOf(this.props.match.params.resourceType) === -1 )
          return null;

        let buttons = []

        if(this.state.isList) {
          buttons.push({
            title:"Add",
            action:()=>{this.handleAddPrototype()},
            icon: <FontAwesome name='plus'/>,
            disabled:false
          });
        }

        buttons.push({
          title:"Save",
          action: this.handleSave,
          icon: <FontAwesome name='floppy-o'/>,
          disabled:this.state.hasError
        });
        buttons.push({
          title:"Sync",
          action: this.handlePublish,
          icon: <FontAwesome name='refresh'/>,
          disabled:false
        });

        if('admin|owner|developer'.indexOf(this.state.resourceRole) !== -1 || InstaAdminConfig.role =='admin'){
          buttons.push({
            title:"Schema",
            action: ()=>{this.props.history.push(this.props.sConfig.baseAdminPath+"/"+this.props.match.params.resourceType+"/"+this.state.appId+"/builder")},
            icon: <FontAwesome name='sitemap'/>,
            disabled:false
          });
        }

        return (
          <div>
          {/*<div style={{position:'fixed',backgroundColor:'#fff',padding:'25px'}}>Updated: {this.state.updated}</div>*/}
          <ConfirmDialog 
            active={this.state.confirmDialog} 
            closeDialog={()=>this.setState({confirmDialog:false})} 
            actionDialogCallback={(index)=>{this.state.deleteAction(index)}}/>
          <Header title={"Content Editor - "+this.state.title} subtitle="Edit and update app data." buttons={buttons}/>
          <div className={theme.editorWorkspace}>
            <SchemaNavigation 
              appData={this.state.rawAppData} 
              appId={this.state.appId} 
              sConfig={this.props.sConfig} 
              nodeId={this.state.nodeId}
              resourceType={this.props.match.params.resourceType}
              handleNavClick={()=>this.setState({selectedNodeData:[],selectedNodeId:null})}/>
            <div className={theme.sortForms}>
            <div className={theme.sortParentContainer}>
              <SortableList 
                items={this.state.nodeData} 
                onSortEnd={(oI,e)=>{this.handleOnSortEnd(oI,e,false);}} 
                isList={this.state.isList} 
                shouldCancelStart={()=>{return !this.state.isList && 'admin|owner|developer'.indexOf(this.state.resourceRole) === -1}}
                appId={this.state.appId} 
                handleFormChange={(node,index,pIndex,val,field)=>{this.handleFormChange(node,index,pIndex,val,field)}}
                handleDeleteListNode={(index)=>{this.openDeleteDialog(index)}}
                pressDelay={200}
                parentIndex={null}
                selectedNodeId={this.state.selectedNodeId}
                lockAxis='y'
                useDragHandle={true}
                resourceType={this.props.match.params.resourceType} 
                resourceRole={this.state.resourceRole} 
                sConfig={this.props.sConfig}
                handleComponentClick={(node,index)=>this.handleComponentClick(node,index)}
                useRouter={false}/>
            </div>
            {this.state.selectedNodeData.length > 0 && 
              <div className={theme.sortChildContainer}>
                <div className={theme.sortChildHeader}><FontIcon onClick={()=>this.setState({selectedNodeData:[],selectedNodeId:null})} style={{fontSize:'1.6em',fontWeight:'bold',cursor:'pointer'}} value='arrow_back' /><div>{this.state.selectedNodeName}</div><div>&nbsp;</div></div>
                <div className={theme.sortChildBody}>
                  <SortableList 
                    items={this.state.selectedNodeData} 
                    onSortEnd={(oI,e)=>{this.handleOnSortEnd(oI,e,true);}} 
                    isList={this.state.selectedNodeisList} 
                    shouldCancelStart={()=>{return !this.state.isList && 'admin|owner|developer'.indexOf(this.state.resourceRole) === -1}}
                    appId={this.state.appId} 
                    handleFormChange={(node,index,pIndex,val,field)=>{this.handleFormChange(node,index,pIndex,val,field)}}
                    handleDeleteListNode={(index)=>{this.openDeleteDialog(index)}}
                    pressDelay={200}
                    lockAxis='y'
                    useDragHandle={true}
                    parentIndex={this.state.selectedNodeIndex}
                    resourceType={this.props.match.params.resourceType} 
                    resourceRole={this.state.resourceRole} 
                    sConfig={this.props.sConfig}
                    handleComponentClick={()=>this.setState({selectedNodeData:[],selectedNodeId:null,selectedNodeIndex:null})}
                    useRouter={true}/>
                </div>
              </div>
            }
            </div>
          </div>
          </div>
        )        
    }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor)