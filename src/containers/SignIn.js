import React from 'react';
import { connect } from 'react-redux';
import { login, retrieve } from '../actions/auth'

class SignIn extends React.Component {

   state = {
      username: '',
      password: ''
   }

   handleChange = (e) => {
      this.setState({
         [e.target.name]: e.target.value
      })
   }

   handleSubmit = (e) => {
      e.preventDefault()
      this.props.login(this.state, this.props.history)
   }

   render() {
      return (
         <div className="session-details">
            <p>Continue your adventure</p>
            <form onSubmit={this.handleSubmit}>
               <label htmlFor="username">Username</label>
               <input type="text" className="username field" value={this.state.username} onChange={this.handleChange} name="username" /><br />
               <label htmlFor="password">Password</label>
               <input type="password" className="password field" value={this.state.password} onChange={this.handleChange} name="password" /><br />
               <input type="submit" className="login-submit" value="Let's go!" />
            </form>
         </div>
      )
   }
}

const mapStateToProps = state => {
   return {
      user: state.auth.currentUser
   }
}

export default connect(mapStateToProps, { login, retrieve })(SignIn);
