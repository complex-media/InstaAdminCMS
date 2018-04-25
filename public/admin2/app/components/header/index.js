var React = require('react');
var ReactDOM = require('react-dom');
import {connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import theme from './header.scss'
import {Button,IconButton} from 'react-toolbox/lib/button';


const mapStateToProps = (state) => {
  return {
  }          
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class Header extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <section className={theme.headerContainer}>
        <div className={theme.headerTop}>
          <div>
            <h2 className={theme.headerTitle}>{this.props.title}</h2>
            {this.props.subtitle && 
              <p className={theme.headerSubtitle}>{this.props.subtitle}</p>
            }
          </div>
          <div className={theme.headerButtonGroup}>
            {this.props.buttons && this.props.buttons.map((btn,i)=>{
              return(
                <Button className={btn.disabled?theme.disabledButton:theme.headerButton} disabled={btn.disabled} key={'headerbtn-'+i} alt={btn.title} onClick={btn.action}>{btn.icon}&nbsp;&nbsp;{btn.title}</Button>
              )
            })}
          </div>
        </div>

        {this.props.children}
      </section>
    )        
  }
}

// connection betweeen react component and redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)