import React from 'react'
import './aboutMe.css'
import { useTranslation } from "react-i18next";

const AboutMe = () => {
  const { t, i18n } = useTranslation();

  return (
    <div id='aboutme-container'>
      <header className={i18n.language === 'he' ? 'about-me-title about-me-hebrew-title' : 'about-me-title'}>{t('aboutMeTitle')}</header>
      <p className={i18n.language === 'he' && 'about-me-hebrew-text'}>
        {t('aboutMeDesc')}
      </p>
    </div>
  )
}

export default AboutMe;
