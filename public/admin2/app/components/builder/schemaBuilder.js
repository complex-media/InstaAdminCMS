import React from 'react';
import {connect } from 'react-redux';
import Dnd from './builderInteractions'
import theme from './builder.scss'

const mapStateToProps = (state) => {
  return {
    sideBarPanelActive:state.sideBarPanelActive,
    sConfig:state.sConfig          
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class SchemaBuilder extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            treeData:{id:null,name:'App',isTop:true},
            selectedNode:{},
            selectedNodeOrig:{},
            resetCreateForm:true,
            fieldNameOverride:false
        }

        this.spacetree = null;
        this.parentNodeId = null;
        this.selectedNodeType = null;
        this.Dnd = null;
        this.lockViz = false;
    }

    componentDidMount(){
        this.createVisualization(this.state.treeData);
    }

    shouldComponentUpdate(nextProps,nextState) {

        if(nextState.treeData.updatedAt != this.state.treeData.updatedAt){
            nextState.treeData.id = nextState.treeData._id;
            this.updateVisualization(nextState.treeData);
            if(this.props.selectedNodeId){
                this.spacetree.select(this.props.selectedNodeId);
            } else {
                this.spacetree.onClick(this.spacetree.root);
            }
        }
        return false;
    }

    updateVisualization(data){
        this.spacetree.loadJSON(data); 
        this.spacetree.compute(); 
        this.spacetree.geom.translate(new $jit.Complex(-200, 0), "current");
    }

    componentWillReceiveProps(newProps) {
        if(newProps.metaData){
            let treeData = newProps.metaData;
            treeData.children = newProps.appData;
            treeData.name = newProps.metaData.title;
            treeData.isTop = true,
            treeData.data = {...newProps.metaData,isTop:true};
            this.setState({treeData});
        }

        if(newProps.sideBarPanelActive != this.props.sideBarPanelActive && window.innerWidth > 700){
            this.refreshBuilder()
        }
    }

    duplicateStructure(dupNode,targetNode){
        this.props.handleOnNodeDrop(dupNode,targetNode);
    }

    displayNodeInfo(node,e){
        this.props.handleOnNodeClick(node,e);
        this.setState({selectedNode:node.data});
        this.props.handleSetSelectedNode(node.id);
        this.selectedNodeType = node.__t;
    };

    _debouncer( func , timeout ) {
       var timeoutID , timeout = timeout || 200;
       return function () {
          var scope = this , args = arguments;
          clearTimeout( timeoutID );
          timeoutID = setTimeout( function () {
              func.apply( scope , Array.prototype.slice.call( args ) );
          } , timeout );
       }
    }

    createVisualization = (ughdata)=>{
        let wrap = document.getElementById('infoVis');
        // offsets sidbar for intial creation
        let width = wrap.offsetWidth < 1100 ? wrap.offsetWidth+300 : wrap.offsetWidth;
        this.spacetree = new $jit.ST({  
            injectInto: 'infoVis',
            width:width,
            height:wrap.offsetHeight,
            backgroundColor: '#ffffff',  
            duration: 300,
            constrained:true,
            levelsToShow:30,
            transition: $jit.Trans.Quart.easeInOut,  
            levelDistance: 65,  
            orientation: 'top',  
            subtreeOffset: 10,  
            siblingOffset: 20, 
            Navigation: {  
                enable:true,  
                panning:'avoid nodes',
                zoom:10
            }, 
            Node: {  
                height: 40,  
                width: 80,  
                type: 'rectangle',  
                color: '#F2F2F2',  
                overridable: true,
            },  
            Edge: {  
                type: 'bezier',  
                overridable: true  
            },
            Label: {  
                type: 'HTML',  
                size: 11,
                style:'italic',
                family:'sans-serif',
                color: '#000'  
            },
            Events: {
                enable: true,  
                onDragStart: (node, eventInfo, e)=>{ 
                    this.Dnd.pickup(node,node.pos.x,node.pos.y); 
                },
                onMouseEnter:(node, eventInfo, e)=>{
                    this.Dnd.enterTarget(node);
                },
                onMouseLeave:(node, eventInfo, e)=>{
                    this.Dnd.leaveTarget(node);
                },
                onDragEnd: (node, eventInfo, e)=>{ 
                    this.Dnd.drop(node, (...args)=>{this.duplicateStructure(...args)});
                    this.spacetree.plot();
                },
                onDragMove:(node,eventInfo,e)=>{
                    let xy = eventInfo.getPos()
                    this.Dnd.update(xy.x,xy.y);
                    this.spacetree.plot();
                    this.Dnd.draw(0,0);
                },
                onMouseMove:(node,eventInfo,e)=>{

                },
                onClick:(node,eventInfo,e)=>{
                    this.Dnd.drop(node);
                },
            },    
            onBeforeCompute: (node)=>{},  
            onAfterCompute: ()=>{},  
            onCreateLabel: (label, node)=>{ 
                let iconHtml = ''; 
                label.id = node.id; 

                let typeIcon = {
                    'Component':'<i class="fa fa-cogs fa-3x" aria-hidden="true"></i><br/>',
                    'Date':'<i class="fa fa-calendar fa-3x" aria-hidden="true"></i><br/>',
                    'Datetime':'<i class="fa fa-clock-o fa-3x" aria-hidden="true"></i><br/>',
                    'Html':'<i class="fa fa-code fa-3x" aria-hidden="true"></i><br/>',
                    'Markdown':'<div class="fa-markdown"><strong><b>**Markdown**</b></strong></div>',
                    'Option':'<i class="fa fa-caret-square-o-down fa-3x" aria-hidden="true"></i><br/>',
                    'Url':'<i class="fa fa-globe fa-3x" aria-hidden="true"></i><br/>',
                    'Text':'<i class="fa fa-file-text-o fa-3x" aria-hidden="true"></i><br/>',
                    'Content':'<i class="fa fa-file-text fa-3x" aria-hidden="true"></i><br/>',
                    'Number':'<i class="fa fa-hashtag fa-3x" aria-hidden="true"></i><br/>',
                    'Resource':'<i class="fa fa-upload fa-3x" aria-hidden="true"></i><br/>',
                    'Css':'<i class="fa fa-paint-brush fa-3x" aria-hidden="true"></i><br/>',
                    'Image':'<i class="fa fa-file-image-o fa-3x" aria-hidden="true"></i><br/>',
                    'Hook':'<i class="fa fa-exchange fa-2x" aria-hidden="true"></i><i class="fa fa-globe fa-3x" aria-hidden="true"></i><br/>',
                }
                if(node.data.__t == 'Component' && node.data.isList) {   
                    iconHtml = '<i class="fa fa-list-ol fa-3x" aria-hidden="true"></i><br/>';
                } else if(node.data.isTop) {
                    iconHtml = '<i class="fa fa-flask fa-3x" aria-hidden="true"></i><i class="fa fa-plus fa-1x" aria-hidden="true"></i><i class="fa fa-cog fa-3x" aria-hidden="true"></i><br/>';
                } else if(typeIcon[node.data.__t]){
                    iconHtml = typeIcon[node.data.__t];
                }

                label.innerHTML = iconHtml + node.name ;  

                if(node.data.isPrototype){
                    label.innerHTML = label.innerHTML + '<b> (Protoype)</b>';
                }
                
                label.onclick = (e) =>{  

                    // if(normal.checked) {  
                    this.displayNodeInfo(node,e);
                    this.spacetree.onClick(node.id,{
                        onComplete:()=>{},
                        Move:{ enable:false}
                    });

                };  
                //set label styles  
                let style = label.style;  
                style.width = 80 + 'px';  
                style.height = 40 + 'px';              
                style.cursor = 'pointer';  
                style.color = '#333';  
                style.fontSize = '0.8em';  
                style.textAlign= 'center';   
                style.paddingTop = '3px';    
            },
            onPlaceLabel: (label, node)=>{ 
                if(node.data.id == this.props.selectedNodeId) {
                    label.style['font-weight'] = 'bold'; 
                }else{
                    label.style['font-weight'] = 'normal'; 
                }
            },
            onAfterPlotNode:(node)=>{
                let ctx = this.spacetree.canvas.getCtx();

                if(node.data.id == this.props.selectedNodeId) {
                    if(this.state.selectedNodeType == 'Component'){
                        ctx.beginPath();
                        ctx.arc(node.pos.x,node.pos.y,35,0,2*Math.PI);
                    }else{
                        ctx.roundRect(node.pos.x,node.pos.y, 110, 70, 10);
                    }
                    ctx.strokeStyle = "#4C4CFF";
                    ctx.lineWidth = 2;
                    ctx.setLineDash([2,2]);
                    ctx.stroke();
                    ctx.setLineDash([1000]); 
                }

            },
            onBeforePlotNode: (node)=>{ 
                if(node.data.__t == 'Component' && node.data.isList) {
                    let i = 0;
                    node.eachSubnode((sNode)=>{ 
                        if(i == 0){
                            sNode.data.isPrototype = true;
                            sNode.data.isSubPrototype = true;
                        }
                        i++;
                    });  
                }
                if(node.data.isPrototype || node.data.isSubPrototype){
                    node.eachSubnode((sNode)=>{ 
                        sNode.data.isSubPrototype = true;
                    }); 
                }
                if (node.selected) { 
                    if(node.data.id == this.props.selectedNodeId) {
                        node.data.$color = "#f2f2f2";
                    }
                    if(node.data.__t == 'Component') {
                        node.data.$color = "#039BE5";
                        node.data.$type = 'circle';
                        node.data.$dim=25;
                    }
                } else {  
                    delete node.data.$color;  
                    if(node.data.__t == 'Component') {
                        node.data.$type = 'circle';
                        node.data.$dim=35;
                        node.data.$color ='#ffcc99';
                    }
                }  
            },  
            onBeforePlotLine: (adj)=>{
                if (adj.nodeFrom.selected && adj.nodeTo.selected) {  
                    adj.data.$color = "#a2c9fb";  
                    adj.data.$lineWidth = 2; 
                }  
                else {  
                    delete adj.data.$color;  
                    delete adj.data.$lineWidth;  
                }  
            }
        }); 
    
        this.Dnd = new Dnd(this.spacetree.canvas.getCtx());
        this.Dnd.setIsValidFunction((topNode,bottomNode)=>{
            let addable = true;
            if(bottomNode == null || bottomNode == null || typeof bottomNode == 'undefined' || typeof bottomNode.data == 'undefined'){
                return false;
            }
            if(bottomNode.data.__t != 'Component'){
                addable = false;
            }
            if(typeof bottomNode.data.bluePrintRule != 'undefined'){
                if(typeof bottomNode.data.bluePrintRule.id != 'undefined'){
                    addable = false;
                }
                if(typeof bottomNode.data.bluePrintRule.id == ''){
                    addable = false;
                }
            }
            return addable;
        });
        this.spacetree.loadJSON(ughdata);  
        //compute node positions and layout  
        this.spacetree.compute();  
        //optional: make a translation of the tree  
        this.spacetree.geom.translate(new $jit.Complex(-200, 200), "current");  
        //emulate a click on the root node.  
        this.spacetree.onClick(this.spacetree.root);

        window.onresize = this._debouncer(()=>{this.refreshBuilder()});
    }

    refreshBuilder(){
        let wrap = document.getElementById('infoVis');

        this.spacetree.canvas.resize(wrap.offsetWidth,wrap.offsetHeight);
        this.spacetree.refresh();
        this.spacetree.plot();
        this.showRefreshOverlay = false;
    } 

    render(){
        return (
            <div className={theme.builderCanvasContainer} style={{height:'74vh',overflow:'hidden',width:'100%'}} id="infoVis"></div>
        )
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaBuilder)