import React from "react";
import "./AddNewPost.css";
import axios from "axios";
import bookSVG from "../../images/book.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";

class AddNewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        id: "",
        content: "",
        title: "",
        imageUrl: "",
        author: "",
      },
      popup: {
        message: null,
        isPopupOpen: false,
        success: false,
      },
    };
  }
  handleTitleChange = (event) => {
    this.setState({
      post: {
        ...this.state.post,
        title: event.target.value,
      },
    });
  };

  handleContentChange = (event) => {
    this.setState({
      post: {
        ...this.state.post,
        content: event.target.value,
      },
    });
  };

  handleImageChange = (event) => {
    this.setState({
      post: {
        ...this.state.post,
        imageUrl: event.target.value,
      },
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { post } = this.state;
    const { title, content } = post;
    if (title && content && title.length <= 30) {
      axios.post("/api/posts", post).then((res) => {
        if (res.status === 200) {
          post.published = res.data.post.published;
          post.id = res.data.post.id;
          post.author = res.data.post.author;
          this.setState({
            ...this.state,
            popup: {
              message: "Post saved successfully",
              isPopupOpen: true,
              success: true,
            },
          });
          setTimeout(() => {
            this.props.history.push(`/posts/${post.id}`);
          }, 3000)
        }
      });
    } else if (title.length > 30) {
      this.setState({
        ...this.state,
        popup: {
          message: "Title must be 30 letters max",
          isPopupOpen: true,
          success: false,
        },
      });
    } else {
      this.setState({
        ...this.state,
        popup: {
          message: "Title and Content are required",
          isPopupOpen: true,
          success: false,
        },
      });
    }
  };

  closePopupIfOpen = () => {
    const { isPopupOpen } = this.state.popup;
    if (isPopupOpen) {
      setTimeout(() => {
        this.setState({
          ...this.state,
          popup: {
            isPopupOpen: false,
            message: null,
          },
        });
      }, 4000);
    }
  };

  render() {
    const { message, success } = this.state.popup;
    const type = success ? "success" : "failed";
    this.closePopupIfOpen();
    return (
      <form className="new-post-container" onSubmit={this.onSubmit}>
        <AlertMessage message={message} type={type} />
        <header id="create-new-post-title">Create New Post</header>
        <div id="new-post-form-container">
          <img id="icon-header-new-post" src={bookSVG} />
          <input
            id="input-add-title"
            type="text"
            placeholder="Post title goes here..."
            onChange={this.handleTitleChange}
          ></input>
          <input
            id="input-add-img"
            type="url"
            placeholder="Paste here your image url"
            onChange={this.handleImageChange}
          ></input>
          <textarea
            id="input-add-content"
            placeholder="Post content goes here..."
            onChange={this.handleContentChange}
          ></textarea>
          <button
            id="create-post-button"
            type="submit"
            onClick={this.handleSavePost}
          >
            Create Post
          </button>
        </div>
      </form>
    );
  }
}

export default AddNewPost;
