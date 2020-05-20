import React from "react";
import Posts from "../../components/Posts";
import Sidebar from "../../components/Sidebar";

const Homepage = (props) => {
  return (
    <div className="home-container">
      <div className="blog-container">
        <header>
          <h1 id="blog-title">This is my blog</h1>
        </header>
        <Posts posts={props.posts} />
      </div>
      <Sidebar posts={props.posts} />
    </div>
  );
};

export default Homepage;
