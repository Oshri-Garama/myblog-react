import React from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

class Navbar extends React.Component  {
  constructor(props) {
    super(props)
    this.state={
      isLoggedIn: props.isLoggedIn
    }
  }

  render() {
  const { isLoggedIn } = this.props;
  return (
    <div className="navbar">
      <div className="left-navbar">
        <Link to="/">
          Home
        </Link>
        {isLoggedIn && <Link className="vr-line-left" to="/about">
          About Me
        </Link>}
        {isLoggedIn && <Link className='vr-line-left' to="/posts/new">New post</Link>}
      </div>
      <div className="right-navbar">
        {!isLoggedIn && <Link className='vr-line-right' to="/signup">Sign Up</Link>}
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {isLoggedIn && <Link to='/' onClick={this.props.handleLogout}>Logout</Link>}
      </div>
    </div>
  );
  }
};

export default Navbar;
