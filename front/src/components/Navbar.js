import React from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="left-navbar">
        <Link className="vr-line" to="/">
          Home
        </Link>
        <Link className="vr-line" to="/about">
          About Me
        </Link>
        <Link to="/posts/new">New post</Link>
      </div>
      <div className="right-navbar">
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Navbar;