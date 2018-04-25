//todo break this into containe-componenet
import React from 'react';
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import Dialog from 'react-toolbox/lib/dialog';
import {Tab, Tabs} from 'react-toolbox/lib/tabs'

import { getHelpDescriptions } from '../../actions'
import theme from './dialog.scss'

const mapStateToProps = (state) => {
  return {             
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHelpDescriptions: () => dispatch(getHelpDescriptions())
  }
}

class HelpDialog extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        helpTabs:[],
        tabIndex:0
      }
    }

    componentDidMount(){
        this.props.getHelpDescriptions().then((resp)=>{
            this.setState({helpTabs:resp.data.appData.helpTabs});
        })
    }

    render() {
        return (
            <Dialog
                theme={theme}
                actions={[{ label: "Close", onClick:this.props.handleCloseDialog}]}
                active={this.props.active}
                onEscKeyDown={this.props.handleCloseDialog}
                onOverlayClick={this.props.handleCloseDialog}
                title={'Instructions'} >
                <section className={theme.content}>
                  <Tabs index={this.state.tabIndex} onChange={(index)=>{this.setState({tabIndex:index})}}>
                    {this.state.helpTabs.map((help,i)=>(
                      <Tab key={i} label={help.title}>
                        <div>
                            <p dangerouslySetInnerHTML={{__html:help.descriptionHtml}}></p>
                        </div>
                      </Tab>
                    ))}
                  </Tabs>
                  <div className={theme.dialogMsg}>{this.props.dialogMsg}</div>
                </section>
              </Dialog>
        )        
    }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpDialog)