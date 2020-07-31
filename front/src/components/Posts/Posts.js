import React from "react";
import "./Posts.css";
import { Link, Redirect } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import deleteSVG from "../../images/icons/delete.svg";
import editSVG from "../../images/icons/edit.svg";
import newPostSVG from "../../images/newPost.svg";
import TagSearcher from '../../components/TagSearcher/TagSearcher'

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || "",
      author: props.author || "",
      content: props.content || "",
      published: props.published || "",
      imageUrl: props.imageUrl || "",
    };
  }
  getFormattedDate = (date) => {
    const dateObj = moment.utc(new Date(date)).format("YYYY-MM-DD");
    return dateObj;
  };

  handleDelete = () => {
    const answer = window.confirm("Are you sure you want to delete this post?");
    if (!answer) return;
    const { id, pathname } = this.props;
    axios
      .post("/api/posts/delete", { post_id: id })
      .then((res) => {
        if (res.status === 200) {
          setTimeout(this.props.getAllPosts(pathname), 300);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          console.log(
            err,
            "The post you are trying to delete is not exist in the database"
          );
        }
      });
  };

  render() {
    const {
      id,
      userLoggedInId,
      author,
      authorId,
      title,
      content,
      imageUrl,
      published,
    } = this.props;
    const publishedDate = this.getFormattedDate(published);
    const daysOfPublished = moment().diff(publishedDate, "days");

    return (
      <div className="post-container">
        <div className="post-content-container">
          <div className="post-title-container">
            <Link className="post-title" to={`/posts/${id}`}>
              {title}
            </Link>
          </div>
          <img className='post-image' src={imageUrl} alt="" />
          <div className="post-content">{content}</div>
        </div>
        <div className="published-time">
          Published{" "}
          {daysOfPublished === 0 ? "today" : `${daysOfPublished} days ago`} by{" "}
          {author}
        </div>
        {userLoggedInId && userLoggedInId === authorId && (
          <div className="post-buttons-container">
            <Link
              to={{
                pathname: `/posts/edit/${id}`,
                state: {
                  id: id,
                  title: title,
                  content: content,
                  imageUrl: imageUrl,
                },
              }}
            >
              <img className="edit-post-icon" src={editSVG} />
            </Link>
            <div className="delete-post-container">
              <button className="delete-post-icon" onClick={this.handleDelete}>
                <img src={deleteSVG} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pathname: this.props.location.pathname,
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

  render() {
    const { pathname } = this.props.location;
    const { userId, isLoggedIn } = this.props;
    if (pathname === '/user/posts' && !isLoggedIn) return <Redirect to='/posts'/>
    const { posts } = this.state;
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
        <TagSearcher />
        <div id="add-new-post-container">
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
