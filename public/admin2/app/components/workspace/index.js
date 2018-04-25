var React = require('react');
var ReactDOM = require('react-dom');
import { BrowserRouter as Router, Route, Link as RouterLink} from 'react-router-dom'
import Applications from '../resourceList/applications';
import AppTemplates from '../resourceList/apptemplates';
import AppComponents from '../resourceList/appcomponents';
import Editor from '../editor';
import Builder from '../builder';
import Role from '../role';
import Invite from '../invite';
import Profile from '../profile';

export default class Workspace extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
        <div className="workspace">
          <Route exact path={this.props.sConfig.baseAdminPath+"/applications"} render={routeProps => <Applications {...routeProps} />} />
          <Route exact path={this.props.sConfig.baseAdminPath} render={routeProps => <Applications {...routeProps} />} />
          <Route exact path={this.props.sConfig.baseAdminPath+"/templates"} render={routeProps => <AppTemplates {...routeProps} />} />
          <Route exact path={this.props.sConfig.baseAdminPath+"/components"} render={routeProps => <AppComponents {...routeProps} />} />
          <Route exact path={this.props.sConfig.baseAdminPath+"/:resourceType/:appId/editor"} component={Editor}/>
          <Route exact path={this.props.sConfig.baseAdminPath+"/:resourceType/:appId/editor/:nodeId"} component={Editor}/>
          <Route exact path={this.props.sConfig.baseAdminPath+"/applications/:appId/builder"} render={routeProps => <Builder {...routeProps} resourceType="Application" />}/>
          <Route exact path={this.props.sConfig.baseAdminPath+"/templates/:appId/builder"} render={routeProps => <Builder {...routeProps} resourceType="Template" />}/>
          <Route exact path={this.props.sConfig.baseAdminPath+"/components/:appId/builder"} render={routeProps => <Builder {...routeProps} resourceType="Component" />}/>
          <Route exact path={this.props.sConfig.baseAdminPath+"/role"} component={Role}/>
          <Route exact path={this.props.sConfig.baseAdminPath+"/invite"} component={Invite}/>
          <Route exact path={this.props.sConfig.baseAdminPath+"/profile"} component={Profile}/>
        </div>
    )        
  }
}