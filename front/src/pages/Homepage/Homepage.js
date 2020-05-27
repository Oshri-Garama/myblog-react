import React from "react";
import Posts from "../../components/Posts";
import Sidebar from "../../components/Sidebar";

const Homepage = (props) => {
  const { posts, isLoggedIn } = props;
  return (
    <div className="home-container">
      <div className="blog-container">
        <header>
          {isLoggedIn ? (
            <h1 id="blog-title">This is my blog</h1>
          ) : (
            <h1 id="blog-title">It can be your blog</h1>
          )}
        </header>
        {!isLoggedIn && <div>Sign up and start sharing your posts or log in if you are already a member </div> }
        {isLoggedIn && (posts.length === 0) && <div>Your first post will be shown here</div> }
        {isLoggedIn && posts !== [] && <Posts posts={posts} /> }
      </div>
      <Sidebar posts={posts} />
    </div>
  );
};

export default Homepage;
