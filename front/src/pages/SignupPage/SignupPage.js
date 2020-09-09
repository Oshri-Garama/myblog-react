import React, { useState, useRef, useEffect } from "react";
import "./SignupPage.css";
import axios from "axios";
import signupSVG from "../../images/signup.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import { useTranslation } from "react-i18next";


const SignupPage = (props) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({
    message: null,
    isPopupOpen: false,
    success: false,
  });
  const formRef = useRef(null);
  const mountedRef = useRef(true);
  const { t, i18n } = useTranslation();

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignup = (event) => {
    event.preventDefault();
    let lastUrlPath = "/";
    const location = props.location.state;
    if (location && location.from) {
      lastUrlPath = location.from;
    }
    if (username === "" || password === "" || fullName === "") {
      setPopup({
        message: t('invalidInput'),
        isPopupOpen: true,
        success: false,
      });
      return;
    }
    else if (username.length > 10) {
      setPopup({
        message: t('usernameMaxLength'),
        isPopupOpen: true,
        success: false,
      });
    }
    axios
      .post("/api/signup", { fullName, username, password })
      .then((res) => {
        if (res.status === 200) {
          props.handleSignup(res.data);
          props.history.push(lastUrlPath);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setPopup({
            message: t('connectToBackendError'),
            isPopupOpen: true,
            success: false,
          });
          console.log(err, "Couldn't connect to database");
        } else if (err.response.status === 409) {
          setPopup({
            message: t('usernameExists'),
            isPopupOpen: true,
            success: false,
          });
          formRef.current.reset();
          setUsername('')
          setPassword('')
          setFullName('')
        }
      });
  };

  useEffect(() => {
    if (popup.isPopupOpen) {
      setTimeout(() => {
        if (mountedRef.current) {
          setPopup({
            isPopupOpen: false,
            message: null,
          });
        }
      }, 4000);
    }
  }, [popup])

  useEffect(() => {
    return () => mountedRef.current = false;
  }, [])

  const renderBasedOnLanguage = () => {
    const language = i18n.language;
    const labelsJSX = (
      <div id="signup-labels-container">
              <div>{t('fullName')}</div>
              <div>{t('username')}</div>
              <div>{t('password')}</div>
      </div>
    );
    const inputsJSX = (
      <div id="signup-inputs-container">
              <input
                className="field-decoration"
                type="text"
                placeholder={t('fullNamePlaceholder')}
                onChange={handleFullNameChange}
                dir={i18n.language === "he" ? "rtl" : "ltr"}
              ></input>
              <input
                className="field-decoration"
                type="text"
                placeholder={t('usernamePlaceholder')}
                onChange={handleUserNameChange}
                dir={i18n.language === "he" ? "rtl" : "ltr"}
              ></input>
              <input
                className="field-decoration"
                type="password"
                placeholder={t('passwordPlaceholder')}
                onChange={handlePasswordChange}
                dir={i18n.language === "he" ? "rtl" : "ltr"}
              ></input>
            </div>
    );
    if (language === "he") {
      return (
        <div className="signup-fields-container signup-fields-container-hebrew">
          {inputsJSX}
          {labelsJSX}
        </div>
      );
    } else {
      return (
        <div className="signup-fields-container">
          {labelsJSX}
          {inputsJSX}
        </div>
      );
    }
  };

  const { message, success } = popup;
  const type = success ? "success" : "failed";

  return (
    <form id="signup-page-container" onSubmit={handleSignup} ref={formRef}>
      <AlertMessage message={message} type={type} />
      <header className={i18n.language === 'he' ? 'signup-title sign-up-hebrew-title' : 'signup-title'}>{t('signUpTitle')}</header>
      <section className="signup-description" className={i18n.language === 'he' ? 'signup-description sign-up-hebrew-description' : 'signup-description'}>
        {t('signUpSubTitle')}
      </section>
      <div id="signup-form-container">
        <div id="signup-image-sepeartor">
          <img src={signupSVG} />
          {renderBasedOnLanguage()}
          <button id="signup-button" type="submit">
            {t('signUp')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignupPage;
