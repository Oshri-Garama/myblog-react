import React from "react";
import "../styles/app.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Homepage from "../pages/Homepage/Homepage";
import AboutMe from "../pages/AboutMe/AboutMe";
import PostPage from "../pages/PostPage/PostPage";
import AddNewPost from "../pages/AddPost/AddNewPost";
import axios from "axios";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";

const port = '5000';
const baseUrl = `http://localhost:${port}`;
const initialState = {
  posts: [],
  isLoggedIn: false,
  userId: '',
  fullName: '',
  username: '',
  isAdmin: false
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState
  }

  handleSignup = (details) => {
    this.setState({
      ...details,
      isLoggedIn: true,
    })
    this.getAllPosts()
  };
  
  handleLogin = (data) => {
    this.setState({
      isLoggedIn: true,
      fullName: data.fullName,
      username: data.username,
      userId: data.userId,
      isAdmin: data.isAdmin
    })
    this.getAllPosts()
    // localStorage.setItem('session', JSON.stringify(this.state))
  }

  handleLogout = () => {
    this.setState(initialState)
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
    axios.get(`${baseUrl}/posts`, {withCredentials: true}).then((res) => {
      if (res.status === 200) {
        this.setState({
          posts: res.data
        });
      }
    }).catch((error) => console.log(error, "Couldn't load posts"))
  } 

  // componentDidMount() {
  //   this.getAllPosts()
  //   const prevState = JSON.parse(localStorage.getItem('session')) || initialState;
  //   this.state=(prevState)
  // }

  // adminGetAllPosts = () => {
  //   axios.get(`${baseUrl}/posts`).then((res) => {
  //     if (res.status === 200) {
  //       this.setState({
  //         posts: res.data
  //       });
  //     }
  //   }).catch((error) => console.log(error, "Couldn't load posts"))
  // } 

  render() {
    const { posts, isLoggedIn, userId } = this.state;
    return (
      <Router basename={process.env.PUBLIC_URL + "/"}>
        <div className="page-container">
          <Navbar key='bla' isLoggedIn={isLoggedIn} handleLogout={this.handleLogout} />
          <Switch>
            <Route path="/about" component={AboutMe}></Route>
            <Route
              path="/posts/new"
              render={(props) => (
                <AddNewPost {...props} handleAddPost={this.handleAddPost} authorId={userId} />
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
              render={(props) => <SignupPage {...props} handleSignup={this.handleSignup} /> }>
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
