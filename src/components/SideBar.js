import React from 'react';
import { Switch, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux';

import logo from '../reactventure.svg';
import Inventory from '../containers/Inventory'
import SignUp from '../components/SignUp'
import SignIn from '../containers/SignIn'
import Welcome from '../components/Welcome'
import About from '../components/About'

class SideBar extends React.Component {
   render() {
      return (
         <div className="sidebar">
            <img src={logo} className="App-logo swingimage" alt="logo" />
            <Inventory />
            <br />
            {!this.props.loggedIn && <Link to="/signup" className="link">New Adventure</Link>}
            <br /><br />
            {!this.props.loggedIn && <Link to="/signin" className="link">Continue Adventure</Link>}
            <br /><br />
            {!this.props.loggedIn && <Link to="/about" className="link">About</Link>}
            <br />
            <Switch>
               <Route exact path="/" component={Welcome} />
               <Route exact path="/signin" component={SignIn} />
               <Route exact path="/signup" component={SignUp} />
               <Route exact path="/about" component={About} />
            </Switch>
         </div>
      )
   }
}

const mapStateToProps = (state) => {
   return {
      loggedIn: state.auth.loggedIn
   }
}

export default connect(mapStateToProps)(SideBar)
