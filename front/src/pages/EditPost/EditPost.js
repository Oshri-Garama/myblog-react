import React from "react";
import "./EditPost.css";
import axios from "axios";
import editSVG from "../../images/edit-logo.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        id: props.location.state.id || "",
        content: props.location.state.content || "",
        title: props.location.state.title || "",
        imageUrl: props.location.state.imageUrl || "",
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
    if (post.title && post.content && post.title.length <= 30) {
      axios.post("/api/posts/edit", post).then((res) => {
        if (res.status === 200) {
          post.published = res.data.published;
          post.author = res.data.author;
          this.setState({
            ...this.state,
            popup: {
              message: "Post updated successfully",
              isPopupOpen: true,
              success: true,
            },
          });
          setTimeout(() => {
            this.props.history.push(`/posts`);
          }, 3000)
        }
      });
    } 
    else if (post.title.length > 30) {
      this.setState({
        ...this.state,
        popup: {
          message: "Title must be 30 letters max",
          isPopupOpen: true,
          success: false,
        }
      })
    }
    else {
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
    const { title, content, imageUrl } = this.state.post;
    const { message, success } = this.state.popup;
    const type = success ? "success" : "failed";
    this.closePopupIfOpen();
    return (
      <form className="new-post-container" onSubmit={this.onSubmit}>
        <AlertMessage message={message} type={type} />
        <header id="create-new-post-title">Edit Your Post</header>
        <div id="new-post-form-container" className="edit-post-container">
          <img id="edit-post-logo" src={editSVG} />
          <input
            id="input-add-title"
            value={title}
            type="text"
            placeholder="Post title goes here..."
            onChange={this.handleTitleChange}
          ></input>
          <input
            id="input-add-img"
            value={imageUrl}
            type="url"
            placeholder="Paste here your image url"
            onChange={this.handleImageChange}
          ></input>
          <textarea
            id="input-add-content"
            value={content}
            placeholder="Post content goes here..."
            onChange={this.handleContentChange}
          ></textarea>
          <button
            id="create-post-button"
            type="submit"
            onClick={this.handleSavePost}
          >
            Update Post
          </button>
        </div>
      </form>
    );
  }
}

export default EditPost;
