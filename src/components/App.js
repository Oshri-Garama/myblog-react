import React from "react";
import "../styles/app.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import postsList from "../data/posts";
import Navbar from "../components/Navbar";
import Homepage from "../pages/Homepage/Homepage";
import AboutMe from "../pages/AboutMe/AboutMe";
import PostPage from "../pages/PostPage/PostPage";
import AddNewPost from "../pages/AddPost/AddNewPost";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: postsList.reverse(),
    };
  }

  handleAddPost = (post) => {
    const { posts } = this.state;
    post.id = posts.length + 1;
    posts.unshift(post);
    this.setState({
      posts: posts,
    });
    localStorage.setItem("posts", JSON.stringify(this.state.posts));
  };

  componentDidMount() {
    const posts = localStorage.getItem("posts") || this.state.posts;
    this.setState({
      posts: JSON.parse(posts),
    });
  }

  componentWillUnmount() {
    localStorage.setItem("posts", JSON.stringify(this.state.posts));
  }

  render() {
    const { posts } = this.state;

    return (
      <Router>
        <div className="page-container">
          <Navbar />

          <Switch>
            <Route path="/about" component={AboutMe}></Route>
            <Route
              path="/posts/new"
              render={(props) => (
                <AddNewPost {...props} handleAddPost={this.handleAddPost} />
              )}
            ></Route>
            <Route
              path="/posts/:id"
              render={(props) => <PostPage {...props} posts={posts} />}
            ></Route>
            <Route path="login"></Route>
            <Route
              path="/"
              render={(props) => <Homepage {...props} posts={posts} />}
            ></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
