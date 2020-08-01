import React from "react";
import "./Posts.css";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import newPostSVG from "../../images/newPost.svg";
import Post from './Post'
import TagsSelector from "../TagsSelector/TagsSelector";
const DISPLAY_NONE = {display: 'none' }
const DISPLAY_BLOCK = {display: 'block' }

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pathname: this.props.location.pathname,
      tags: []
    };
    this._mounted = false;
  }

  getAllPosts = (pathname) => {
    axios
      .get(`/api/${pathname}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            posts: res.data,
          });
        }
      })
      .catch((error) => console.log(error, "Couldn't load posts"));
  };

  componentDidMount = () => {
    const { pathname } = this.props.location;
    this.setState({
      ...this.state,
      pathname: pathname,
    });
    this.getAllPosts(pathname);
  };

  componentWillReceiveProps = (newProps) => {
    const { pathname } = this.props.location;
    if (newProps.location.pathname !== pathname) {
      this.getAllPosts(newProps.location.pathname)
    }
  }

  getSelectedTags = (tags) => {
    this.setState({
      ...this.state,
        tags: tags
    })
    this.filterPosts(tags)
  }

  filterPosts = (tags) => {
    const { pathname } = this.props.location;
    if (!tags.length) {
      this.getAllPosts(pathname)
    }
    else {
      const lastTag = tags[tags.length - 1].name
      axios.get(`/api/posts/filter/${lastTag}`).then(res => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            posts: res.data
          })
        }
      })
    }
  }

  render() {
    const { pathname } = this.props.location;
    const { userId, isLoggedIn } = this.props;
    if (pathname === '/user/posts' && !isLoggedIn) return <Redirect to='/posts'/>
    const { posts, tags } = this.state;
    const headerTitle = pathname === "/posts" ? "Recent Posts" : "My Posts";
    const postsJSX = posts.map((post) => {
      return (
        <Post
          key={post.id}
          id={post.id}
          author={post.author}
          authorId={post.authorId}
          title={post.title}
          content={post.content}
          published={post.published}
          imageUrl={post.imageUrl}
          userLoggedInId={isLoggedIn ? userId : null}
          getAllPosts={this.getAllPosts}
          pathname={pathname}
        />
      );
    });
    return (
      <div id="all-posts-page-container">
        <header id="recent-posts-title">{headerTitle}</header>
        <div id='tag-selector-search'>
          <header id='tag-search-header'>Filter using hashtags</header>
          <TagsSelector action='search' getSelectedTags={this.getSelectedTags} tags={tags} />
        </div>
        <div style={isLoggedIn ? DISPLAY_BLOCK : DISPLAY_NONE} id="add-new-post-container">
          <Link id="add-new-post-button" to="/posts/new">
            <img src={newPostSVG} />
          </Link>
          <header id="recent-posts-button-header">New Post</header>
        </div>
        <div id="recent-posts-container">{postsJSX}</div>
      </div>
    );
  }
}

export default Posts;
