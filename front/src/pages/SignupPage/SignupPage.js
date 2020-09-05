import React from "react";
import "./SignupPage.css";
import axios from "axios";
import signupSVG from "../../images/signup.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";

class SignupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      username: "",
      password: "",
      popup: {
        message: null,
        isPopupOpen: false,
        success: false,
      },
    };
  }

  handleFullNameChange = (event) => {
    this.setState({
      ...this.state,
      fullName: event.target.value,
    });
  };

  handleUserNameChange = (event) => {
    this.setState({
      ...this.state,
      username: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      ...this.state,
      password: event.target.value,
    });
  };

  handleSignup = (event) => {
    event.preventDefault();
    const { fullName, username, password } = this.state;
    let lastUrlPath = "/";
    const location = this.props.location.state;
    if (location && location.from) {
      lastUrlPath = location.from;
    }
    if (username.length > 10) {
      this.setState({
        ...this.state,
        popup: {
          message: "Username must be 10 letters max",
          isPopupOpen: true,
          success: false,
        },
      });
    } else if (username === "" || password === "" || fullName === "") {
      this.setState({
        ...this.state,
        popup: {
          message: "Please provide a valid input",
          isPopupOpen: true,
          success: false,
        },
      });
      return;
    }
    axios
      .post("/api/signup", { fullName, username, password })
      .then((res) => {
        if (res.status === 200) {
          this.props.handleSignup(res.data);
          this.props.history.push(lastUrlPath);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.setState({
            ...this.state,
            popup: {
              message:
                "Problem connecting to the server, please contact support",
              isPopupOpen: true,
              success: false,
            },
          });
          console.log(err, "Couldn't connect to database");
        } else if (err.response.status === 409) {
          this.setState({
            ...this.state,
            popup: {
              message: "Username exists, please choose another one",
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
      <form id="signup-page-container" onSubmit={this.handleSignup} ref="form">
        <AlertMessage message={message} type={type} />
        <header id="signup-title">Start Your Journey Now!</header>
        <section id="signup-description">
          In Writee, you can write every single memory that you experienced
          through your life{"\n"}
          As a member you will have the ability to post private or public posts
          and read other's memories{"\n"}
          So what are you waiting for?{"\n"}
        </section>
        <div id="signup-form-container">
          <div id="signup-image-sepeartor">
            <img src={signupSVG} />
            <div id="signup-fields-container">
              <div id="signup-labels-container">
                <div>Full Name:</div>
                <div>User name:</div>
                <div>Password:</div>
              </div>
              <div id="signup-inputs-container">
                <input
                  className="field-decoration"
                  type="text"
                  placeholder="Type here your full name..."
                  onChange={this.handleFullNameChange}
                ></input>
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
            <button id="signup-button" type="submit">
              Sign Up
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default SignupPage;
