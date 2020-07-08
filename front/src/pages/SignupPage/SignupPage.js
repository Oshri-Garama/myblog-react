import React from "react";
import "./SignupPage.css";
import axios from "axios";
import signupSVG from "../../images/signup.svg";

// const port = '5000';
// const baseUrl = `http://ec2-54-209-175-208.compute-1.amazonaws.com:${port}`;

class SignupPage extends React.Component {
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
    let lastUrlPath = '/'
    const location = this.props.location.state
    if (location && location.from) {
      lastUrlPath = location.from;
    }
    if (username === "" || password === "" || fullName === "") {
      alert("Please provide a valid input");
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
          alert(
            "There is a problem connecting to the server, please contact the administrator"
          );
          console.log(err, "Couldn't connect to database");
        } else if (err.response.status === 409) {
          alert("The username is already exist, please choose another one");
          this.refs.form.reset();
        }
      });
  };

  render() {
    return (
      <form id="signup-page-container" onSubmit={this.handleSignup} ref="form">
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
            <img src={signupSVG}/>
            <div id='signup-fields-container'>
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
            </div>
        </div>
        <button id="signup-button" type="submit">
          Sign Up
        </button>
      </form>
    );
  }
}

export default SignupPage;
