import React from 'react';

class AceEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editorId:this.props.editorId?"ace-editor-"+this.props.editorId:'ace-editor'
        }
    }

    componentDidMount(){
        this.aceEditor = ace.edit(this.state.editorId);
        this.aceEditor.setAutoScrollEditorIntoView(true);
        this.aceEditor.setOption("maxLines", 10);
        this.aceEditor.setOption("minLines", 2);
        this.aceEditor.$blockScrolling = 'Infinity';



        if (this.props.options.theme !== undefined)
            this.aceEditor.setTheme("ace/theme/"+this.props.options.theme);
        if (this.props.options.mode !== undefined)
            this.aceEditor.getSession().setMode("ace/mode/"+this.props.options.mode);
        if (this.props.options.gutter !== undefined)
            this.aceEditor.renderer.setShowGutter(this.props.options.gutter)
        if (this.props.options.wrapMode !== undefined)
            this.aceEditor.getSession().setUseWrapMode(this.props.options.wrapMode);
        if (this.props.options.printMargin !== undefined)
            this.aceEditor.setShowPrintMargin(this.props.options.printMargin);
        this.aceEditor.setValue(this.props.value,-1);
        this.aceEditor.on("change",(e)=>{
            this.props.editorChange(this.aceEditor.getValue());
        })

        

    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.value,this.aceEditor.getValue(),this.props.value);
        if(nextProps.value!=false&&nextProps.value != this.aceEditor.getValue()){
            this.aceEditor.setValue(nextProps.value);
        }
    }

    componentWillUnmount(){
        this.aceEditor.destroy();
    }

    render(){
        return(
            <div>
                <label style={{fontSize:'12px',color:'rgba(0, 0, 0, 0.26)',fontFamily:"'Roboto', 'Helvetica', 'Arial', 'sans-serif'"}}>{this.props.name}</label>
                <div id={this.state.editorId} style={{position:'relative',width:'100%'}}></div>
            </div>
        )
    }

}

export default AceEditor;