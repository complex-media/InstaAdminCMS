//todo break this into containe-componenet
import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { Link as RouterLink} from 'react-router-dom';
import theme from './schemaNavigation.scss';

const mapStateToProps = (state) => {
  return {
    sConfig:state.sConfig             
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class SchemaNavigation extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        navOpen:true,
        appId:null,
        nodeId:null,
        levels:[]
      }

    }

    flattenStructure(appData,row,parentIsList){
      let levels = [];

      appData.forEach((node)=>{
        if(node.__t == 'Component') {
          let name = node.name;
          if(parentIsList){
            name = node.children.reduce((name,cNode)=>{if(cNode.fieldName=='title'){return cNode.value}else{return name}},name)
          }

          levels.push({name:name,_id:node._id,level:row,selected:this.props.nodeId==node._id?true:false,isList:node.isList?true:false})
          if (node.children && node.children.length > 0){
            let childLevels = this.flattenStructure(node.children,row+1,node.isList);
            if(node.isList){// removes first entry prototype
              childLevels.shift();
            }
            if (childLevels && childLevels.length > 0) {
              levels = levels.concat(childLevels);
            }
          }
        }
      })
      // console.log('why is this being hit');

      return levels;
    }

    componentWillReceiveProps(newProps) {
      let levels = this.flattenStructure(newProps.appData,1,false)
      levels.unshift({name:'Main',_id:null,level:0,selected:this.props.nodeId==null?true:false,isList:false})
      this.setState({levels});
    }

    render(){

        return (
          <div className={this.state.navOpen?theme.navContainer:theme.navContainerClosed}>
            <div className={theme.navHeader}>
              <div><IconButton onClick={()=>this.setState({navOpen:!this.state.navOpen})}><FontAwesome style={{fontSize:'1.5em'}} name='folder'/></IconButton><span style={{display:this.state.navOpen?'inline':'none'}} >&nbsp;&nbsp;&nbsp;Overview </span></div>
              <IconButton style={{display:this.state.navOpen?'inline':'none',padding:'0px 35px'}} onClick={()=>this.setState({navOpen:!this.state.navOpen})}><FontAwesome name='chevron-left'/></IconButton>
            </div>
            <div className={theme.navBody} style={{display:this.state.navOpen?'block':'none'}} >
              {this.state.levels.map((data,i)=>(
                <RouterLink key={'level'+i} onClick={()=>this.props.handleNavClick()}style={{textDecoration:'none'}} to={this.props.sConfig.baseAdminPath+"/"+this.props.resourceType+"/"+this.props.appId+"/editor/"+(data._id||'')}><div className={data.selected?theme.navLevelSelected:theme.navLevel} style={{padding:'5px 0px 5px '+(data.level*15 + 10)+'px' }}>{data.name.charAt(0).toUpperCase() + data.name.slice(1)} {data.isList?'(List)':''}</div></RouterLink>
              ))}
            </div>
          </div>
        )        
    }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaNavigation)