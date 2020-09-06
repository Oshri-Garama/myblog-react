import React, { useState, useRef, useEffect } from "react";
import "./LoginPage.css";
import axios from "axios";
import loginSVG from "../../images/signin.svg";
import loginLogoSVG from "../../images/login-logo.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import { useTranslation } from "react-i18next";

const LoginPage = (props) => {
  const [username, setUserame] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({
    message: null,
    isPopupOpen: false,
    success: false,
  });
  const formRef = useRef(null);
  const { t, i18n } = useTranslation();

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
        message: t("invalidInput"),
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
            message: t("connectToBackendError"),
            isPopupOpen: true,
            success: false,
          });
          console.log(err, "Couldn't connect to database");
        } else if (err.response.status === 401) {
          setPopup({
            message: t("loginIncorrectDetails"),
            isPopupOpen: true,
            success: false,
          });
          formRef.current.reset();
          setUserame('')
          setPassword('')
        }
      });
  };
  
  useEffect(() => {
    if (popup.isPopupOpen) {
      setTimeout(() => {
        setPopup({
          isPopupOpen: false,
          message: null,
        });
      }, 4000);
    }
  }, [popup])

  const renderBasedOnLanguage = () => {
    const language = i18n.language;
    const labelsJSX = (
      <div className="labels-container">
        <div>{t("username")}</div>
        <div>{t("password")}</div>
      </div>
    );
    const inputsJSX = (
      <div id="inputs-container">
        <input
          className="field-decoration"
          type="text"
          placeholder={t("usernamePlaceholder")}
          onChange={handleUserNameChange}
          dir={language === "he" ? "rtl" : "ltr"}
        ></input>
        <input
          className="field-decoration"
          type="password"
          placeholder={t("passwordPlaceholder")}
          onChange={handlePasswordChange}
          dir={language === "he" ? "rtl" : "ltr"}
        ></input>
      </div>
    );
    if (language === "he") {
      return (
        <div className="fields-container fields-container-hebrew">
          {inputsJSX}
          {labelsJSX}
        </div>
      );
    } else {
      return (
        <div className="fields-container">
          {labelsJSX}
          {inputsJSX}
        </div>
      );
    }
  };

  const { message, success } = popup;
  const type = success ? "success" : "failed";
  

  return (
    <form id="login-container-page" onSubmit={handleLogin} ref={formRef}>
      <AlertMessage message={message} type={type} />
      <img id="login-logo-svg" src={loginLogoSVG} />
      <div className="form-container">
        <div className="image-sepeartor">
          <img src={loginSVG} />
          {renderBasedOnLanguage()}
          <button className="login-button" type="submit">
            {t("login")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
