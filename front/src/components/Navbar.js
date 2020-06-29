import React from "react";
import "../styles/navbar.css";
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
      <div className="navbar">
        <div className="left-navbar">
          <Link to="/">Home</Link>
          {isLoggedIn && (
            <Link className="vr-line-left" to="/about">
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
        <div className="right-navbar">
          <Link className="vr-line-right" to="#">
            Change Language
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
