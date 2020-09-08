import React from "react";
import "../styles/app.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar'
import Homepage from "../pages/Homepage/Homepage";
import AboutMe from "../pages/AboutMe/AboutMe";
import PostPage from "../pages/PostPage/PostPage";
import AddOrEditPost from "../pages/AddOrEditPost/AddOrEditPost";
import axios from "axios";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import loader from '../images/loader.svg'
import Posts from "./Posts/Posts";

const initialState = {
  posts: [],
  userId: null,
  username: null,
  fullName: null,
  isAdmin: false,
  isLoggedIn: null,
  isLoading: true,
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    }
  }

  handleSignup = (details) => {
    this.setState({
      isLoggedIn: true,
      ...details,
      isLoading: false
    })
  };

  handleLogin = (data) => {
    this.setState({
      isLoggedIn: true,
      isLoading: false,
      ...data
    })
  };

  handleLogout = () => {
    axios.post('/api/logout', {withCredentials: true}).then(() => {
    }).catch((error) => console.log(error, "Theres no such a session_id"))
    this.setState({
      ...initialState,
      isLoading: false
    })
  }
  

  componentDidMount = () => {
    this.setState({
      ...this.state,
      isLoading: true
    })
    axios.get('/api/verify_session').then(res => {
      if (res.status === 200) {
        if (res.data.verified === false) {
          this.setState({
            isLoading: false
          })
          return
        }
        else {
          this.setState({
            isLoggedIn: true,
            username: res.data.username,
            fullName: res.data.fullName,
            userId: res.data.userId,
            isAdmin: res.data.isAdmin,
            isLoading: false
          })
        }
      }
    })
  }
  
  render() {
    const { posts, isLoggedIn, userId, username } = this.state;
    if (this.state.isLoading) return <div id='loader-container'><img id='loader' src={loader}></img></div>
    return (
      <Router>
        <div id='constant-seperator'>
          <div>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={this.handleLogout} />
          </div>
        </div>
          <Switch>
            <Route path="/about" component={AboutMe}></Route>
            <Route
              path={["/posts/new", "/posts/edit/:id"]}
              render={(props) => (
                <AddOrEditPost {...props} isLoggedIn={isLoggedIn} />
              )}
            ></Route>
            <Route
              path="/posts/:id"
              render={(props) => <PostPage {...props} username={username} isLoggedIn={isLoggedIn}/>}
            ></Route>
            <Route
              path="/user/posts"
              //continue here... check for posts is there need for that?
              render={(props) => <Posts {...props} posts={posts} isLoggedIn={isLoggedIn} userId={userId}/>}
            ></Route>
            <Route
              path="/posts"
              render={(props) => <Posts {...props} isLoggedIn={isLoggedIn} userId={userId}/>}
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
              render={(props) => <Homepage {...props} posts={posts} userId={userId} isLoggedIn={isLoggedIn} />}
            ></Route>
          </Switch>
      </Router>
    );
  }
}

export default App;
