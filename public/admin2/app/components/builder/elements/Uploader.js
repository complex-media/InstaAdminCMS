import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import { BrowseButton, Button } from "react-toolbox/lib/button";

import { uploadFile } from '../../../actions'
import theme from './elements.scss'

const mapStateToProps = (state) => {
  return {             
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: (id,eid,file,cb) => {
     dispatch(uploadFile(id,eid,file,cb));
    }
  }
}

class Uploader extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            uploadDialog:false,
            file:{},
            isUploading:false,
            errMsg:false,
            disabledAction:true,
        }
    }

    handleUpload(){
        this.validateUpload()
        this.setState({isUploading:true});
        this.props.uploadFile(this.props.appId,this.props._id,this.state.file,(resp)=>{
            this.setState({isUploading:false});
            if(resp.status == 'ok') {
              this.props.onUpload(resp.data);
              this.closeDialog();
            } else {
               this.setState({errMsg:resp.response});
            }
            
        });
    }

    validateUpload(){

    }

    handleSelectFile(e){
        if(e.target.files.length > 0){
          let errMsg = this.props.handleFileValidation(e.target.files[0]);
          if (errMsg) {
            this.setState({disabledAction:true,errMsg});
          } else {
            this.setState({disabledAction:false,file:e.target.files[0],errMsg});
          }
        }     
    }

    closeDialog(){
        this.setState({uploadDialog:false,disabledAction:true,file:{}})
    }

    render(){
        let actions = [
            { label: "Upload", disabled:this.state.disabledAction, onClick: ()=>{this.handleUpload()} },
            { label: "Cancel", onClick: ()=>{this.closeDialog()} }
        ];

        return(
            <div>
                <Dialog
                  actions={actions}
                  active={this.state.uploadDialog}
                  onEscKeyDown={()=>{this.closeDialog()}}
                  onOverlayClick={()=>{this.closeDialog()}}

                  title='Upload'
                >
                  <div>
                    <div>
                      <BrowseButton id="upload-input"
                          icon="file_upload"
                          label="Select File"
                          onChange={(e)=>{this.handleSelectFile(e)}} />

                      <div>
                        {this.state.file.name && 
                            <div>{this.state.file.name} - {this.state.file.size}.kb - {this.state.file.type}</div>
                        }

                      </div>
                      <div>
                        {this.state.errMsg}
                      </div>
                    </div>
                  </div>
                </Dialog>
                <Button  className={theme.uploadButton} raised alt="Upload" onClick={()=>this.setState({uploadDialog:true})}><FontAwesome className='overwride-ft-rx' name='upload' /> Upload</Button>
            </div>
        )
    }
}

//connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Uploader);