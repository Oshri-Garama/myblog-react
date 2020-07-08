import React from "react";
import "./LoginPage.css";
import axios from "axios";
import loginSVG from "../../images/signin.svg";
import loginLogoSVG from "../../images/login-logo.svg";

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
      username: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    // added state from to save the last page and then on success redirect there.
    const lastUrlPath = this.props.location.state.from || '/'
    if (username === "" || password === "") {
      alert("Please provide a valid input");
      this.refs.form.reset();
      return;
    }
    axios
      .post("/api/login", { username, password })
      .then((res) => {
        if (res.status === 200) {
          this.props.handleLogin(res.data);
          this.props.history.push(lastUrlPath);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          alert(
            "There is a problem connecting to the server, please contact the administrator"
          );
          console.log(err, "Couldn't connect to database");
        } else if (err.response.status === 401) {
          alert("The username or the password you provided is incorrect");
          this.refs.form.reset();
        }
      });
  };

  render() {
    return (
      <form id="login-container-page" onSubmit={this.handleLogin} ref="form">
        <img id='login-logo-svg' src={loginLogoSVG}/>
        <div className="form-container">
          <div className="image-sepeartor">
            <img src={loginSVG} />
            <div className="fields-container">
              <div className="labels-container">
                <div>User name:</div>
                <div>Password:</div>
              </div>
              <div id="inputs-container">
                <input
                  className="field-decoration"
                  type="text"
                  placeholder="Type here your user name..."
                  onChange={this.handleUserNameChange}
                ></input>
                <input
                  className="field-decoration"
                  type="password"
                  placeholder="Type here your password..."
                  onChange={this.handlePasswordChange}
                ></input>
              </div>
            </div>
          </div>
        </div>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    );
  }
}

export default LoginPage;
