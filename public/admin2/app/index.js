import {createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';
import Notification from './components/header/notification';
import Workspace from './components/workspace';
import ToolBar from './components/toolbar';
import SideBar from './components/sidebar';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import rootReducer from './reducers';
import {initialState} from './constants'

// import { ThemeProvider } from 'react-css-themr';
import './main.scss';



let sConfig = InstaAdminConfig;

let store = createStore(rootReducer , initialState, applyMiddleware(thunkMiddleware));
// initial state can be usesd when grabbing from local storage or also defining it the reducer slices.

ReactDOM.render(
  <Router>
    <Provider store={store}>
    <div style={{display:'flex',flexDirection:'row',justifyContent: 'space-between'}}>
      <Route component={SideBar}/>
      <div style={{width:'100%'}}>
        <ToolBar/>
        <Workspace sConfig={sConfig}/>
        <div className="spacer" style={{height:'2px',width:'100%'}}></div>
      </div>
      <Notification/>
    </div>
    </Provider>
  </Router>,
  document.getElementById('react-container')
);