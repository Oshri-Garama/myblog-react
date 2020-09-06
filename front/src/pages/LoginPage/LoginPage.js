import React, { useState, useRef } from "react";
import "./LoginPage.css";
import axios from "axios";
import loginSVG from "../../images/signin.svg";
import loginLogoSVG from "../../images/login-logo.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import { useTranslation } from 'react-i18next'

const LoginPage = (props) => {
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({
    message: null,
    isPopupOpen: false,
    success: false,
  });
  const formRef = useRef(null);
  const { t } = useTranslation();

  const handleUserNameChange = (event) => {
    setUserame(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // added state from to save the last page and then on success redirect there.
    let lastUrlPath = "/";
    const location = props.location.state;
    if (location && location.from) {
      lastUrlPath = location.from;
    }
    if (username === "" || password === "") {
      setPopup({
        message: "Please provide a valid input",
        isPopupOpen: true,
        success: false,
      });
      formRef.current.reset();
      return;
    }
    axios
      .post("/api/login", { username, password })
      .then((res) => {
        if (res.status === 200) {
          props.handleLogin(res.data);
          props.history.push(lastUrlPath);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setPopup({
            message: "Problem connecting to the server, please contact support",
            isPopupOpen: true,
            success: false,
          });
          console.log(err, "Couldn't connect to database");
        } else if (err.response.status === 401) {
          setPopup({
            message: "The username or the password you provided is incorrect",
            isPopupOpen: true,
            success: false,
          });
          formRef.current.reset();
        }
      });
  };

  const closePopupIfOpen = () => {
    if (popup.isPopupOpen) {
      setTimeout(() => {
        setPopup({
          isPopupOpen: false,
          message: null,
        });
      }, 4000);
    }
  };

  const { message, success } = popup;
  const type = success ? "success" : "failed";
  closePopupIfOpen();
  return (
    <form id="login-container-page" onSubmit={handleLogin} ref={formRef}>
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
                onChange={handleUserNameChange}
              ></input>
              <input
                className="field-decoration"
                type="password"
                placeholder="Type here your password..."
                onChange={handlePasswordChange}
              ></input>
            </div>
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
