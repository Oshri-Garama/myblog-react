import React from "react";
import "../styles/navbar.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import posts from "../data/posts";
import Homepage from '../pages/Homepage/Homepage'
import AboutMe from '../pages/AboutMe/AboutMe'
import PostPage from '../pages/PostPage/PostPage'


const Navbar = () => {
  return (
    <Router>
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

      <Switch>
        <Route path='/about' component={AboutMe}></Route>
        <Route path='/posts/new'>
          <h1>New Post</h1>
        </Route>
        <Route path='/posts/:id' render={props => <PostPage {...props} posts={posts} />}></Route>
        <Route path='login'></Route>
        <Route path='/' render={props => <Homepage {...props} posts={posts}/>}>
        </Route>
      </Switch>
    </Router>
  );
};

export default Navbar;
