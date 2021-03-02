import React from 'react';
import { signup } from '../actions/auth'
import { connect } from 'react-redux';

class SignUp extends React.Component {

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
      this.props.signup(this.state)
      this.props.history.push('/')
   }

   render() {
      return (
         <div className="session-details">
            <p>Start a new adventure</p>
            <form onSubmit={this.handleSubmit}>
               <label htmlFor="username">Username</label>
               <input value={this.state.username} name="username" onChange={this.handleChange} type="text" className="username field" /><br />
               <label htmlFor="password">Password</label>
               <input value={this.state.password} name="password" onChange={this.handleChange} type="password" className="password field" /><br />
               <input type="submit" className="login-submit" value="Let's begin." />
            </form>
         </div>
      )
   }
}

export default connect(null, { signup })(SignUp)
