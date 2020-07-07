import React from "react";
import "./EditPost.css";
import axios from "axios";
import editSVG from "../../images/edit-logo.svg";

// const port = '5000';
// const url = `http://ec2-54-209-175-208.compute-1.amazonaws.com:${port}/posts`;

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
      saved: false,
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
    if (post.title && post.content) {
      axios.post("/api/posts/edit", post).then((res) => {
        if (res.status === 200) {
          post.published = res.data.published;
          post.author = res.data.author;
          alert("Post updated successfully");
          this.props.history.push("/");
        }
      });
    } else {
      alert("Title and Content are required");
    }
  };

  render() {
    const { title, content, imageUrl } = this.state.post;
    return (
      <form className="new-post-container" onSubmit={this.onSubmit}>
        <header id="create-new-post-title">Edit Your Post</header>
        <div id="new-post-form-container" className='edit-post-container'>
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
