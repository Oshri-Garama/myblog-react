import React from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";
import newPostSVG from "../../images/newPost.svg";
import allPostsSVG from "../../images/allPosts.svg";
import myPostsSVG from "../../images/myPosts.svg";
import signInSVG from "../../images/signin.svg";
import signUpSVG from "../../images/signup.svg";
import writerSVG from "../../images/writer.svg";
import useWindowSize from '../../utils/useWindowSize'

const Homepage = (props) => {
  
  const renderUserHomepage = () => {
    return (
      <div id="buttons-homepage">
        <div className="button-container">
          <Link className="button-homepage" to="/posts/new">
            <img className='icon-svg' src={newPostSVG} />
          </Link>
          <header className='button-header-container-homepage'>New Post</header>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/posts">
            <img className='icon-svg' src={allPostsSVG} />
          </Link>
          <header className='button-header-container-homepage'>All Posts</header>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/user/posts">
            <img className='icon-svg' src={myPostsSVG} />
          </Link>
          <header className='button-header-container-homepage'>My Posts</header>
        </div>
      </div>
    );
  };

  const renderGuestHomepage = () => {
    return (
      <div id="buttons-homepage">
        <div className="button-container">
          <Link className="button-homepage" to="/login">
            <img className='icon-svg' src={signInSVG} />
          </Link>
          <header className='button-header-container-homepage'>Login</header>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/signup">
            <img className='icon-svg' src={signUpSVG} />
          </Link>
          <header className='button-header-container-homepage'>Sign Up</header>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/about">
            <img className='icon-svg' src={writerSVG} />
          </Link>
          <header className='button-header-container-homepage'>About Me</header>
        </div>
      </div>
    );
  };
  const { innerWidth } = useWindowSize()
  
  return (
    <div className={innerWidth > 600 ? "home-container" : "home-container home-mobile"}>
      <div id="title-container">
        <header id="web-title">Writee</header>
        <header id="web-subtitle">Memories Don't Last Forever</header>
      </div>
      {props.isLoggedIn ? renderUserHomepage() : renderGuestHomepage()}
    </div>
  );
}

export default Homepage;
