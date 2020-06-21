import React from "react";
import "../styles/app.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Homepage from "../pages/Homepage/Homepage";
import AboutMe from "../pages/AboutMe/AboutMe";
import PostPage from "../pages/PostPage/PostPage";
import AddNewPost from "../pages/AddPost/AddNewPost";
import EditPost from "../pages/EditPost/EditPost";
import axios from "axios";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import Cookies from 'js-cookie'


// const port = '5000';
// const baseUrl = `http://ec2-54-209-175-208.compute-1.amazonaws.com:${port}`;
const initialState = {
  isLoggedIn: false,
  userId: '',
  fullName: '',
  username: '',
  isAdmin: false,
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoggedIn: '',
      username: '',
      userId: '',
      fullName: '',
      isAdmin: ''
    }
  }

  handleSignup = (details) => {
    this.setState({
      ...details,
      isLoggedIn: true,
    })
    localStorage.setItem('session', JSON.stringify(this.state))
  };
  
  handleLogin = (data) => {
    const loggedState = {
      isLoggedIn: true,
      fullName: data.fullName,
      username: data.username,
      userId: data.userId,
      isAdmin: data.isAdmin
    }
    this.setState(loggedState)
    localStorage.setItem('session', JSON.stringify(loggedState))
  }

  handleLogout = () => {
    this.setState(initialState)
    localStorage.setItem('session', JSON.stringify(initialState))
    axios.post('/logout', {withCredentials: true}).then(() => {
    }).catch((error) => console.log(error, "Theres no such a session_id"))
  }

  handleAddPost = (post) => {
    const { posts } = this.state;
    posts.unshift(post)
    this.setState({
      posts: posts
    })
    this.getAllPosts()
  };

  handleEditPost = () => {
    this.getAllPosts()
  }

  handleDeletePost = () => {
    this.getAllPosts()
  }

  getAllPosts = () => {
    axios.get('/posts', {withCredentials: true}).then((res) => {
      if (res.status === 200) {
        this.setState({
          posts: res.data
        });
      }
    }).catch((error) => console.log(error, "Couldn't load posts"))
  } 

  getUsername = () => {
    return this.state.username
  }

  componentDidMount() {
    this.getAllPosts()
    const prevState = JSON.parse(localStorage.getItem('session')) || initialState;
    this.setState(prevState)
  }

  render() {
    const { posts, isLoggedIn, userId, username } = this.state;
    return (
      <Router>
        <div className="page-container">
          <Navbar isLoggedIn={isLoggedIn} handleLogout={this.handleLogout} />
          <Switch>
            <Route path="/about" component={AboutMe}></Route>
            <Route
              path="/posts/new"
              render={(props) => (
                <AddNewPost {...props} handleAddPost={this.handleAddPost} authorId={userId} />
              )}
            ></Route>
            <Route
              path="/posts/edit/:id"
              render={(props) => (
                <EditPost {...props} handleEditPost={this.handleEditPost} />
              )}
            ></Route>
            <Route
              path="/posts/:id"
              render={(props) => <PostPage {...props} getUsername={this.getUsername} isLoggedIn={isLoggedIn}/>}
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
              render={(props) => <Homepage {...props} posts={posts} isLoggedIn={isLoggedIn} userId={userId} handleDeletePost={this.handleDeletePost} />}
            ></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
