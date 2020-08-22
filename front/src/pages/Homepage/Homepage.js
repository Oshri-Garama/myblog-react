import React from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";
import newPostSVG from "../../images/newPost.svg";
import allPostsSVG from "../../images/allPosts.svg";
import myPostsSVG from "../../images/myPosts.svg";
import signInSVG from "../../images/signin.svg";
import signUpSVG from "../../images/signup.svg";
import writerSVG from "../../images/writer.svg";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
  }

  renderUserHomepage = () => {
    return (
      <div id="buttons-homepage">
        <div className="button-container">
          <Link className="button-homepage" to="/posts/new">
            <img src={newPostSVG} />
          </Link>
          <header className='button-header-container-homepage'>New Post</header>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/posts">
            <img src={allPostsSVG} />
          </Link>
          <header className='button-header-container-homepage'>All Posts</header>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/user/posts">
            <img src={myPostsSVG} />
          </Link>
          <header className='button-header-container-homepage'>My Posts</header>
        </div>
      </div>
    );
  };

  renderGuestHomepage = () => {
    return (
      <div id="buttons-homepage">
        <div className="button-container">
          <Link className="button-homepage" to="/login">
            <img src={signInSVG} />
          </Link>
          <header className='button-header-container-homepage'>Login</header>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/signup">
            <img src={signUpSVG} />
          </Link>
          <header className='button-header-container-homepage'>Sign Up</header>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/about">
            <img src={writerSVG} />
          </Link>
          <header className='button-header-container-homepage'>About Me</header>
        </div>
      </div>
    );
  };


  render() {
    const { isLoggedIn } = this.props;
    return (
      <div className="home-container">
        <div id="title-container">
          <header id="web-title">Writee</header>
          <header id="web-subtitle">Memories Don't Last Forever</header>
        </div>
        {isLoggedIn ? this.renderUserHomepage() : this.renderGuestHomepage()}
      </div>
    );
  }
}

export default Homepage;
