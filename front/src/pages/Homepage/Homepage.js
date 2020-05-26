import React from "react";
import Posts from "../../components/Posts";
import Sidebar from "../../components/Sidebar";

class Homepage extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      isLoggedIn: props.isLoggedIn
    }
  }
  render() {
    const { posts } = this.props
    return (
      <div className="home-container">
      <div className="blog-container">
        <header>
          <h1 id="blog-title">This is my blog</h1>
        </header>
        {posts === [] ? <div>Currently there are no posts...</div> : <Posts posts={posts} />}
      </div>
      <Sidebar posts={posts} />
    </div>
    )
  };
};

export default Homepage;
