import React from "react";
import "./LoginPage.css";
import axios from 'axios'

// const port = '5000';
// const baseUrl = `http://ec2-54-209-175-208.compute-1.amazonaws.com:${port}`;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleUserNameChange = (event) => {
    this.setState({
      username: event.target.value
    })
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  };

  handleLogin = (event) => {
    event.preventDefault();
    const {username, password} = this.state
    if (username === '' || password === '') {
      alert('Please provide a valid input')
      this.refs.form.reset()
      return
    }
    axios.post('/api/login' ,{username, password }).then(res => {
      if (res.status === 200) {
        this.props.handleLogin(res.data)
        this.props.history.push('/')
      }
    }).catch((err) => {
      if (err.response.status === 404) {
        alert('There is a problem connecting to the server, please contact the administrator')
        console.log(err, 'Couldn\'t connect to database')
      }
      else if (err.response.status === 401) {
        alert('The username or the password you provided is incorrect')
        this.refs.form.reset()
      }
    })
  }

  render() {
    return (
      <form className="login-container" onSubmit={this.handleLogin} ref='form'>
        <h1>Login</h1>
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
          Login
        </button>
      </form>
    );
  }
}

export default LoginPage;
