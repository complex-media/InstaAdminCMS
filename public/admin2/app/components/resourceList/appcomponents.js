import React from 'react';
import {connect } from 'react-redux';
import Resource from './resource'


const mapStateToProps = (state) => {
  return{}
}

const mapDispatchToProps = (dispatch) => {
  return{}
}

class AppComponents extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <Resource {...this.props} resourceType="Component"/>
    )
  }
}

//connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponents)