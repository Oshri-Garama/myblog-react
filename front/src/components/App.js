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
import moment from 'moment'
// moment.locale('he')

const port = '5000';
const url = `http://localhost:${port}/posts`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  handleAddPost = (post) => {
    const { posts } = this.state;
    post.authorId = 2;
    axios.post(url, post).then(res => {
      let data = humps.camelizeKeys(res.data)
      post.id = data.postId
      post.published = data.createdAt
      posts.unshift(post)
      this.setState({
        posts: posts,
      });
    })
  };

  componentWillMount() {
    axios.get(url).then((res) => {
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

  render() {
    const { posts } = this.state;

    return (
      <Router basename={process.env.PUBLIC_URL + "/"}>
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
            <Route path="/login"></Route>
            <Route
              path={"/"}
              render={(props) => <Homepage {...props} posts={posts} />}
            ></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
