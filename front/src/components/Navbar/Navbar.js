import React, {useState} from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import {ReactComponent as EnglishIcon} from '../../images/icons/english.svg'
import {ReactComponent as HebrewIcon} from '../../images/icons/hebrew.svg'

const Navbar = (props) => {
  const handleLogout = () => {
    props.handleLogout();
  };
  const { isLoggedIn } = props;
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en')

  const changeLanguage = (selectedLanguage) => {
    if (selectedLanguage !== language) {
      i18n.changeLanguage(selectedLanguage)
      setLanguage(selectedLanguage)
    }
  }

  return (
    <div className="navbar-container">
      <div id="left-navbar">
        <Link className="vr-line-right" to="/">
          {t('home')}
        </Link>
        <Link className="vr-line-right" to="/posts">
          {t('allPosts')}
        </Link>
        {isLoggedIn && (
          <Link className="vr-line-right" to="/user/posts">
            {t('myPosts')}
          </Link>
        )}
        <Link className={isLoggedIn ? "vr-line-right mobile-vr-line-right-logged" : "vr-line-right mobile-vr-line-right"}to="/about">
          {t('aboutMe')}
        </Link>
      </div>
      <div id="right-navbar">
        <div className='languages-container'>
          <button className='transparent' type='submit' onClick={() => changeLanguage('en')}><EnglishIcon className={language === 'en' ?'english-language-selected' : ''}/></button>
          <button className='transparent' type='submit' onClick={() => changeLanguage('he')}><HebrewIcon className={language !== 'en' ? 'hebrew-language-selected' : '' }/></button>
        </div>
        <Link
          className="vr-line-right vr-line-left"
          to="#"
        >
          {t('english')}
        </Link>
        {!isLoggedIn && (
          <Link className="vr-line-right" to="/signup">
            {t('signUp')}
          </Link>
        )}
        {!isLoggedIn && <Link to="/login">{t('login')}</Link>}
        {isLoggedIn && (
          <Link to="/" onClick={handleLogout}>
            {t('logOut')}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
