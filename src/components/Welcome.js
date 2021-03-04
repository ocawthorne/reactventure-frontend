import React from 'react';
import { connect } from 'react-redux';
import { checkLoggedIn, logout, save, retrieve } from '../actions/auth'
import { clearHistory } from '../actions/entryField'

class Welcome extends React.Component {

   saveProgress = () => {
      this.props.save(
         this.props.user,

         this.props.userHistory,
         this.props.inventory,
         this.props.knownObjects,
         this.props.brokenObjects,
         this.props.uniqueEvents
      )
      alert('Game saved!')
   }

   logoutConfirm = () => {
      if (window.confirm('Are you sure you wish to log out? All unsaved progress will be lost!')) {
         this.props.logout()
         this.props.clearHistory()
      }
   }

   render() {
      return (
         <div>
            {this.props.loggedIn ? <p className="welcome">Welcome, {this.props.user.username}</p> : <p className="welcome">Welcome!<br />Please create an account to begin your adventure, or login to continue.</p>}
            {this.props.loggedIn && <button className="entry submit" onClick={this.saveProgress}>Save Progress</button>}
            <br /><br /><br />
            {this.props.loggedIn && <button className="entry submit" onClick={this.logoutConfirm}>Log Out</button>}
         </div>
      )
   }
}

const mapStateToProps = state => {
   return {
      loggedIn: state.auth.loggedIn,
      user: state.auth.currentUser,

      userHistory: state.commands.userHistory,
      inventory: state.commands.userObjects,
      knownObjects: state.commands.knownObjects,
      brokenObjects: state.commands.brokenObjects,
      uniqueEvents: state.commands.uniqueEvents
   }
}

export default connect(mapStateToProps, { checkLoggedIn, logout, save, retrieve, clearHistory })(Welcome)
