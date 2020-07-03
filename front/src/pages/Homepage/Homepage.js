import React from "react";
import Posts from "../../components/Posts/Posts";
import "./Homepage.css";
import TopFive from "../../components/TopFive/TopFive";
import Sidebar from "../../components/Sidebar/Sidebar";
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
          <text>New Post</text>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/posts">
            <img src={allPostsSVG} />
          </Link>
          <text>All Posts</text>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/">
            <img src={myPostsSVG} />
          </Link>
          <text>My Posts</text>
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
          <text>Sign In</text>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/signup">
            <img src={signUpSVG} />
          </Link>
          <text>Sign Up</text>
        </div>
        <div className="button-container">
          <Link className="button-homepage" to="/about">
            <img src={writerSVG} />
          </Link>
          <text>About Me</text>
        </div>
      </div>
    );
  };

  componentDidMount = () => {};

  render() {
    const { posts, userId, isLoggedIn } = this.props;
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
