import React from "react";
import "./LoginPage.css";
import axios from "axios";
import loginSVG from "../../images/signin.svg";
import loginLogoSVG from "../../images/login-logo.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      popup: {
        message: null,
        isPopupOpen: false,
        success: false,
      },
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
    let lastUrlPath = "/";
    const location = this.props.location.state;
    if (location && location.from) {
      lastUrlPath = location.from;
    }
    if (username === "" || password === "") {
      this.setState({
        ...this.state,
        popup: {
          message: "Please provide a valid input",
          isPopupOpen: true,
          success: false,
        },
      });
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
          this.setState({
            ...this.state,
            popup: {
              message: "Problem connecting to the server, please contact support",
              isPopupOpen: true,
              success: false,
            },
          });
          console.log(err, "Couldn't connect to database");
        } else if (err.response.status === 401) {
          this.setState({
            ...this.state,
            popup: {
              message: "The username or the password you provided is incorrect",
              isPopupOpen: true,
              success: false,
            },
          });
          this.refs.form.reset();
        }
      });
  };

  closePopupIfOpen = () => {
    const { isPopupOpen } = this.state.popup;
    if (isPopupOpen) {
      setTimeout(() => {
        this.setState({
          ...this.state,
          popup: {
            isPopupOpen: false,
            message: null,
          },
        });
      }, 4000);
    }
  };

  render() {
    const { message, success } = this.state.popup;
    const type = success ? "success" : "failed";
    this.closePopupIfOpen();
    return (
      <form id="login-container-page" onSubmit={this.handleLogin} ref="form">
        <AlertMessage message={message} type={type} />
        <img id="login-logo-svg" src={loginLogoSVG} />
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
