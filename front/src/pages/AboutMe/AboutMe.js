import React from 'react'
import './aboutMe.css'
import { useTranslation } from "react-i18next";
import linkedinSVG from '../../images/icons/linkedin.svg'
import githubSVG from '../../images/icons/github.svg'

const LINKEDIN_URL = 'https://il.linkedin.com/in/oshri-garama-00a301196'
const GITHUB_URL = 'https://github.com/Oshri-Garama/myblog-react'

const AboutMe = () => {
  const { t, i18n } = useTranslation();

  return (
    <div id='aboutme-container'>
      <header className={i18n.language === 'he' ? 'about-me-title about-me-hebrew-title' : 'about-me-title'}>{t('aboutMeTitle')}</header>
      <p className={i18n.language === 'he' ? 'about-me-hebrew-text' : ''}>
        {t('aboutMeDesc')}
      </p>
      <div className='aboutme-ctas'>
        <a href={LINKEDIN_URL} target={"_blank"}>
          <img className='linkedin-icon' src={linkedinSVG}/>
        </a>
        <a href={GITHUB_URL} target={"_blank"}>
          <img src={githubSVG}/>
        </a>
      </div>
    </div>
  )
}

export default AboutMe;
