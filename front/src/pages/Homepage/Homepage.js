import React from "react";
import Posts from "../../components/Posts";
import Sidebar from "../../components/Sidebar";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { posts, userId, isLoggedIn } = this.props;
    return (
      <div className="home-container">
        <div className="blog-container">
          <header>
            <h1 id="blog-title">Latests Posts</h1>
          </header>
          <Posts posts={posts} isLoggedIn={isLoggedIn} userId={userId} />
        </div>
        <Sidebar posts={posts} />
      </div>
    );
  }
}

export default Homepage;
