import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactComponent as EnglishIcon } from "../../images/icons/english.svg";
import { ReactComponent as HebrewIcon } from "../../images/icons/hebrew.svg";

const Navbar = (props) => {
  const handleLogout = () => {
    props.handleLogout();
  };
  const { isLoggedIn } = props;
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");  

  const changeLanguage = (selectedLanguage) => {
    if (selectedLanguage !== language) {
      i18n.changeLanguage(selectedLanguage);
      setLanguage(selectedLanguage);
      localStorage.setItem('language', selectedLanguage);
    }
  };

  useEffect(() => {
    const prevLanguage = localStorage.getItem('language');
    setLanguage(prevLanguage);
    i18n.changeLanguage(prevLanguage);
  }, [])

  return (
    <div className={i18n.language === "he" ? "navbar-container navbar-container-hebrew" : "navbar-container"}>
      <div id="left-navbar">
        <Link className="vr-line-right" to="/">
          {t("home")}
        </Link>
        <Link className={i18n.language === "en" ? (isLoggedIn ? "vr-line-right" : "")  : "vr-line-right"} to="/posts">
          {t("allPosts")}
        </Link>
        {isLoggedIn && (
          <Link className={isLoggedIn ? (i18n.language === "he") ? "vr-line-right" : "" : "vr-line-right"} to="/user/posts">
            {t("myPosts")}
          </Link>
        )}
        <Link
          className={
            isLoggedIn
              ? "vr-line-right vr-line-left mobile-vr-line-right-logged"
              : "vr-line-right vr-line-left mobile-vr-line-right"
          }
          to="/about"
        >
          {t("aboutMe")}
        </Link>
      </div>
      <div id="right-navbar">
        <div className="languages-container">
          <button
            className={language === "en" ? "selected-en mobile-en-icon" : "transparent mobile-en-icon"}
            type="submit"
            onClick={() => changeLanguage("en")}
          >
            <EnglishIcon
              className={language === "en" ? "english-language-selected" : ""}
            />
          </button>
          <button
            className={language !== "en" ? "selected-he mobile-he-icon" : "transparent mobile-he-icon"}
            type="submit"
            onClick={() => changeLanguage("he")}
          >
            <HebrewIcon
              className={language !== "en" ? "hebrew-language-selected" : ""}
            />
          </button>
        </div>
        {!isLoggedIn && (
          <Link className="vr-line-right vr-line-left" to="/signup">
            {t("signUp")}
          </Link>
        )}
        {!isLoggedIn && <Link to="/login">{t("login")}</Link>}
        {isLoggedIn && (
          <Link className='vr-line-left' to="/" onClick={handleLogout}>
            {t("logOut")}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
