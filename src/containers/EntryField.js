import React, { Component } from 'react'
import { connect } from 'react-redux';
import { submitEntryField, updateEntryField } from '../actions/entryField'
// import { submitLoginField } from '../actions/signIn';

class EntryField extends Component {

   handleChange = (event) => {
      const currentCommand = event.target.value.toLowerCase()
      this.props.updateEntryField(currentCommand)
   }

   handleSubmit = (event) => {
      event.preventDefault()
      this.props.submitEntryField(this.props.command.trim())
      this.props.updateEntryField('')
   }

   render() {
      return (
         <form onSubmit={this.handleSubmit} className="entry-form">
            <input type="text" onChange={this.handleChange} value={this.props.command} className="entry text" disabled={!this.props.loggedIn}/>
            <input type="submit" value="Develop the plot..." className="entry submit" disabled={!this.props.loggedIn} />
         </form>
      )
   }
}

const mapStateToProps = state => {
   return {
      currentUser: state.auth.currentUser,
      loggedIn: state.auth.loggedIn,
      userObjects: state.commands.userObjects,
      knownObjects: state.commands.knownObjects,
      userHistory: state.commands.userHistory,
      command: state.commands.command,
      uniqueEvents: state.auth.currentUser.uniqueEvents
   }
}

export default connect(mapStateToProps, { updateEntryField, submitEntryField })(EntryField);
