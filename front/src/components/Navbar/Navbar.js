import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import useWindowSize from '../../utils/useWindowSize'

const Navbar = (props) => {
  const handleLogout = () => {
    props.handleLogout();
  };
  const { isLoggedIn } = props;
  const { innerWidth } = useWindowSize()

  return (
    <div className={innerWidth > 600 ? "navbar-container" : "navbar-container navbar-mobile" }>
      <div id="left-navbar">
        <Link className="vr-line-right" to="/">
          Home
        </Link>
        <Link className="vr-line-right" to="/posts">
          All Posts
        </Link>
        {isLoggedIn && (
          <Link className="vr-line-right" to="/user/posts">
            My Posts
          </Link>
        )}
        <Link className={innerWidth > 600 ? "vr-line-right" : ""} to="/about">
          About Me
        </Link>
      </div>
      <div id="right-navbar">
        <Link
          id="change-language-link"
          className="vr-line-right vr-line-left"
          to="#"
        >
          English
        </Link>
        {!isLoggedIn && (
          <Link className="vr-line-right" to="/signup">
            Sign Up
          </Link>
        )}
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {isLoggedIn && (
          <Link to="/" onClick={handleLogout}>
            Logout
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
