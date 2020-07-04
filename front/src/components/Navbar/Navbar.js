import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    this.props.handleLogout();
  };

  render() {
    const { isLoggedIn } = this.props;
    return (
      <div id="navbar-container">
        <div id="left-navbar">
          <Link className='vr-line-right' to="/">Home</Link>
          {isLoggedIn && (
            <Link to="/about">
              About Me
            </Link>
          )}
          {isLoggedIn && (
            <Link className="vr-line-left" to="/posts/new">
              New post
            </Link>
          )}
          {isLoggedIn && (
            <Link className='vr-line-left' to="#">
              My Posts
            </Link>
          )}
        </div>
        <div id="right-navbar">
          <Link id='change-language-link' className='vr-line-right vr-line-left' to="#">
            English
          </Link>
          {!isLoggedIn && (
            <Link className="vr-line-right" to="/signup">
              Sign Up
            </Link>
          )}
          {!isLoggedIn && <Link to="/login">Login</Link>}
          {isLoggedIn && (
            <Link to="/" onClick={this.handleLogout}>
              Logout
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default Navbar;