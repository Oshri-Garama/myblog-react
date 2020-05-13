import React from "react";
import "../styles/app.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import posts from "../data/posts";
import Navbar from "../components/Navbar";
import Homepage from "../pages/Homepage/Homepage";
import AboutMe from "../pages/AboutMe/AboutMe";
import PostPage from "../pages/PostPage/PostPage";
import AddNewPost from "../pages/AddPost/AddNewPost";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page-container">
        <Router>
          <Navbar />
          <Switch>
            <Route path="/about" component={AboutMe}></Route>
            <Route
              path="/posts/new"
              render={(props) => <AddNewPost {...props} posts={posts} />}
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
        </Router>
      </div>
    );
  }
}

export default App;
