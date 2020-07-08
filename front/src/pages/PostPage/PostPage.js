import React from "react";
import axios from "axios";
import Comments from "../../components/Comment";
import "./PostPage.css";
import commentSVG from "../../images/icons/comment.svg";
import { Link } from 'react-router-dom'

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || "",
      post: "",
      comment: "",
      username: "",
      comments: [],
    };
  }

  componentDidMount() {
    const { id } = this.state;
    axios
      .get(`/api/posts/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            post: res.data.post,
            comments: res.data.comments,
          });
        }
      })
      .catch((error) => console.log(error, "Couldn't load posts"));
  }

  handleCommentChange = (event) => {
    this.setState({
      ...this.state,
      comment: event.target.value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { id: postId, comment } = this.state;
    const { username } = this.props;
    if (comment && username) {
      axios
        .post(
          `/api/comments/${postId}`,
          { postId, comment },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            alert("Your comment should be on the top!");
            window.location.reload();
          }
        });
    } else {
      alert("Comment can not be empty");
    }
  };

  renderPostImage = () => {
    const { post } = this.state
    if (post.imageUrl) 
    return (
      <img id="post-image-post-page" src={post.imageUrl} />
    )
    return null
  }

  render() {
    const { id, post, comments } = this.state;
    const { isLoggedIn } = this.props;
    return (
      <div className="post-view-page">
        <header id="post-view-title">{post.title}</header>
        <div className="post-view-container">
          <div id="post-page-seperator">
            {this.renderPostImage()}
            <div className="post-view-content">{post.content}</div>
          </div>
          <form
            className="comment-input-container"
            onSubmit={this.onSubmit}
            disabled={!isLoggedIn}
          >
            <textarea
              id="comment-inputarea"
              placeholder="Leave a comment..."
              onChange={this.handleCommentChange}
              disabled={!isLoggedIn}
            ></textarea>
            <button id="comment-button" disabled={!isLoggedIn}>
              <img id="comment-icon" src={commentSVG} />
            </button>
            <div id="comments-container">
              {!isLoggedIn && (
                <section id='comment-unlogged-error'>
                  To comment you must {' '}
                 <Link className='comment-section-link' to='/login'>
                  login
                </Link>
                {' '} OR {' '}
                 <Link className='comment-section-link' to='/signup'>
                   sign up
                 </Link>
                </section>
              )}
              <header id="post-view-comments-header">Comments</header>
              <Comments comments={comments} />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default PostPage;
