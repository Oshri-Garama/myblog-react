import React from "react";
import "./SignupPage.css";
import axios from 'axios'

const port = '5000';
const baseUrl = `http://localhost:${port}`;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      username: "",
      password: "",
    };
  }

  handleFullNameChange = (event) => {
    this.setState({
      ...this.state,
      fullName: event.target.value
    })
  };

  handleUserNameChange = (event) => {
    this.setState({
      ...this.state,
      username: event.target.value
    })
  };

  handlePasswordChange = (event) => {
    this.setState({
      ...this.state,
      password: event.target.value
    })
  };

  handleSignup = (event) => {
    event.preventDefault();
    const {fullName, username, password} = this.state
    if (username === '' || password === '' || fullName === '') {
      alert('Please provide a valid input')
      return
    }
    axios.post(`${baseUrl}/signup` ,{fullName, username, password }).then(res => {
      if (res.status === 200) {
        this.props.handleSignup(res.data)
        this.props.history.push('/')
      }
    })
  }

  render() {
    return (
      <form className="login-container" onSubmit={this.handleSignup}>
        <h1>Sign Up</h1>
        <div id="fullname-container">
          <div>Full Name:</div>
          <input
            className="field-decoration"
            type="text"
            placeholder="Type here your full name..."
            onChange={this.handleFullNameChange}
          ></input>
        </div>
        <div id="username-container">
          <div>User name:</div>
          <input
            className="field-decoration"
            type="text"
            placeholder="Type here your user name..."
            onChange={this.handleUserNameChange}
          ></input>
        </div>
        <div id="password-container">
          <div>Password:</div>
          <input
            className="field-decoration"
            type="password"
            placeholder="Type here your password..."
            onChange={this.handlePasswordChange}
          ></input>
        </div>
        <button className="login-button" type="submit">
          Sign Up
        </button>
      </form>
    );
  }
}

export default LoginPage;
