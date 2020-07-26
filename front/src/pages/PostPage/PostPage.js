import React from "react";
import axios from "axios";
import Comments from "../../components/Comment";
import "./PostPage.css";
import commentSVG from "../../images/icons/comment.svg";
import { Link } from "react-router-dom";
import Scrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AlertMessage from '../../components/AlertMessage/AlertMessage'

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || "",
      post: "",
      comment: "",
      username: "",
      comments: [],
      tags: [],
      popup: {
        message: null,
        isPopupOpen: false,
        success: false,
      },
    };
    this.comp = React.createRef();
  }

  componentDidMount() {
    this.fetchPostPage()
  }

  fetchPostPage = () => {
    const { id } = this.state;
    axios
      .get(`/api/posts/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            post: res.data.post,
            comments: res.data.comments,
            tags: res.data.tags
          });
        }
      })
      .catch((error) => console.log(error, "Couldn't load posts"));
  }

  componentWillUnmount = () => {
    this.ps = null;
  };

  componentDidUpdate = () => {
    this.ps = new Scrollbar(this.comp.current);
  };

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
            this.setState({
              ...this.state,
              popup: {
                message: "Your comment should be on the top",
                isPopupOpen: true,
                success: true,
              },
              comment: ''
            });
            this.fetchPostPage()
            this.refs.form.reset();
          }
        });
    } else {
      this.setState({
        ...this.state,
        popup: {
          message: "Comment can not be empty",
          isPopupOpen: true,
          success: false
        }
      });
    }
  };

  renderPostImage = () => {
    const { post } = this.state;
    if (post.imageUrl)
      return <img id="post-image-post-page" src={post.imageUrl} />;
    return null;
  };

  closePopupIfOpen = () => {
    const { isPopupOpen } = this.state.popup
    if (isPopupOpen) {
      setTimeout(() => {
        this.setState({
          ...this.state,
          popup: {
            isPopupOpen: false,
            message: null,
          }
        })
      }, 4000)
    }
  }

  renderTags = () => {
    const { tags } = this.state
    console.log(tags)
    const tagsJSX = tags.map(tag => {
      return (
        <div className='tag-label' key={parseInt(tag.id)}>#{tag.name}</div>
      )
    })
    return <div id='tags-container'>{tagsJSX}</div>
  }

  render() {
    const { post, comments  } = this.state;
    const { message, success, isPopupOpen } = this.state.popup
    const { isLoggedIn } = this.props;
    const type = success ? 'success' : 'failed';
    this.closePopupIfOpen()
    return (
      <div className="post-view-page">
        <AlertMessage message={message} type={type} />
        <header id="post-view-title">{post.title}</header>
        <div className="post-view-container">
          <div id="post-page-seperator">
            {this.renderPostImage()}
            <div className="post-view-content">{post.content}</div>
            {this.renderTags()}
          </div>
          <form
            className="comment-input-container"
            onSubmit={this.onSubmit}
            disabled={!isLoggedIn}
            ref="form"
          >
            <textarea
              id="comment-inputarea"
              placeholder="Leave a comment..."
              onChange={this.handleCommentChange}
              disabled={!isLoggedIn}
            ></textarea>
            <button id="comment-button" disabled={(!isLoggedIn || isPopupOpen) && success}>
              <img id="comment-icon" src={commentSVG} />
            </button>
            <div id="comments-container">
              {!isLoggedIn && (
                <section id="comment-unlogged-error">
                  To comment you must{" "}
                  <Link
                    className="comment-section-link"
                    to={{
                      pathname: "/login",
                      state: {
                        from: this.props.location,
                      },
                    }}
                  >
                    login
                  </Link>{" "}
                  OR{" "}
                  <Link
                    className="comment-section-link"
                    to={{
                      pathname: "/signup",
                      state: {
                        from: this.props.location,
                      },
                    }}
                  >
                    sign up
                  </Link>
                </section>
              )}
              <header id="post-view-comments-header">Comments</header>
              <div id="comments-list" ref={this.comp}>
                <Comments comments={comments} />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default PostPage;
