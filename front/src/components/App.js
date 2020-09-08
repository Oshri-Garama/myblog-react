import React, { useState, useEffect } from "react";
import "../styles/app.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Homepage from "../pages/Homepage/Homepage";
import AboutMe from "../pages/AboutMe/AboutMe";
import PostPage from "../pages/PostPage/PostPage";
import AddOrEditPost from "../pages/AddOrEditPost/AddOrEditPost";
import axios from "axios";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import loader from "../images/loader.svg";
import Posts from "./Posts/Posts";
import { useTranslation } from "react-i18next";

const App = (props) => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");  

  const handleSignup = (details) => {
    setFullName(details.fullName);
    setIsAdmin(details.isAdmin);
    setUserId(details.userId);
    setUsername(details.username);
  };

  const handleLogin = (data) => {
    setIsLoading(false);
    setIsLoggedIn(true);
    setFullName(data.fullName);
    setIsAdmin(data.isAdmin);
    setUserId(data.userId);
    setUsername(data.username);
  };

  const handleLogout = () => {
    axios
      .post("/api/logout", { withCredentials: true })
      .then(() => {})
      .catch((error) => console.log(error, "Theres no such a session_id"));
    setIsLoading(false);
    setPosts([]);
    setUserId(null);
    setUsername(null);
    setFullName(null);
    setIsAdmin(false);
    setIsLoggedIn(null);
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/verify_session").then((res) => {
      if (res.status === 200) {
        if (res.data.verified === false) {
          return setIsLoading(false);
        } else {
          setIsLoggedIn(true);
          setIsLoading(false);
          setUsername(res.data.username);
          setFullName(res.data.fullName);
          setUserId(res.data.userId);
          setIsAdmin(res.data.isAdmin);
        }
      }
    });
  }, []);

    useEffect(() => {
    const prevLanguage = localStorage.getItem('language') || 'en';
    setLanguage(prevLanguage);
    i18n.changeLanguage(prevLanguage);
  }, [])

  if (isLoading)
    return (
      <div id="loader-container">
        <img id="loader" src={loader}></img>
      </div>
    );
  return (
    <Router>
      <div id="constant-seperator">
        <div>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
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
          render={(props) => (
            <PostPage {...props} username={username} isLoggedIn={isLoggedIn} />
          )}
        ></Route>
        <Route
          path="/user/posts"
          //continue here... check for posts is there need for that?
          render={(props) => (
            <Posts
              {...props}
              posts={posts}
              isLoggedIn={isLoggedIn}
              userId={userId}
            />
          )}
        ></Route>
        <Route
          path="/posts"
          render={(props) => (
            <Posts {...props} isLoggedIn={isLoggedIn} userId={userId} />
          )}
        ></Route>
        <Route
          path="/login"
          render={(props) => <LoginPage {...props} handleLogin={handleLogin} />}
        ></Route>
        <Route
          path="/signup"
          render={(props) => (
            <SignupPage {...props} handleSignup={handleSignup} />
          )}
        ></Route>
        <Route
          path={"/"}
          render={(props) => (
            <Homepage
              {...props}
              posts={posts}
              userId={userId}
              isLoggedIn={isLoggedIn}
            />
          )}
        ></Route>
      </Switch>
    </Router>
  );
};

export default App;
