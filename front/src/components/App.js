import React from "react";
import "../styles/app.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Homepage from "../pages/Homepage/Homepage";
import AboutMe from "../pages/AboutMe/AboutMe";
import PostPage from "../pages/PostPage/PostPage";
import AddNewPost from "../pages/AddPost/AddNewPost";
import axios from "axios";
import humps from 'humps'
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";

const port = '5000';
const baseUrl = `http://localhost:${port}`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoggedIn: false
    };
  }
  
  handleLogin = () => {
    this.setState({
      isLoggedIn: true
    })
  }

  handleLogout = () => {
    this.setState({
      isLoggedIn: false
    })
  }

  handleAddPost = (post) => {
    const { posts } = this.state;
    posts.unshift(post)
    this.setState({
      posts: posts
    })
    this.getAllPosts()
  };

  getAllPosts = () => {
    axios.get(`${baseUrl}/posts`).then((res) => {
      if (res.status === 200) {
        let data = humps.camelizeKeys(res.data)
        data = data.map(data => {
          return {
            id: data.postId,
            author: data.fullName,
            title: data.title,
            content: data.content,
            image: data.imageUrl,
            published: data.createdAt
          }
        })
        this.setState({
          posts: data
        });
      }
    }).catch((error) => console.log(error, "Couldn't load posts"))
  } 

  componentDidMount() {
    this.getAllPosts()
  }

  render() {
    const { posts, isLoggedIn } = this.state;

    return (
      <Router basename={process.env.PUBLIC_URL + "/"}>
        <div className="page-container">
          <Navbar isLoggedIn={isLoggedIn} handleLogout={this.handleLogout} />
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
              render={(props) => <PostPage {...props} />}
            ></Route>
            <Route 
              path="/login"
              render={(props) => <LoginPage {...props} handleLogin={this.handleLogin} /> }>
            </Route>
            <Route 
              path="/signup"
              render={(props) => <SignupPage {...props} /> }>
            </Route>
            <Route
              path={"/"}
              render={(props) => <Homepage {...props} posts={posts} isLoggedIn={isLoggedIn} />}
            ></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
