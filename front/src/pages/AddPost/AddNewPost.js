import React from "react";
import "./AddNewPost.css";

class AddNewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        content: "",
        title: "",
        imageUrl: ""
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
      this.props.handleAddPost(post);
      alert("Post saved successfully");
      this.props.history.push("/");
    } else {
      alert("Title and Content are required");
    }
  };

  render() {
    return (
      <form className="new-post-container" onSubmit={this.onSubmit}>
        <h1>Create New Post</h1>
        <input
          id="input-title"
          type="text"
          placeholder="Post title goes here..."
          onChange={this.handleTitleChange}
        ></input>
        <input
          id="input-title"
          type="url"
          placeholder="Paste here your image url"
          onChange={this.handleImageChange}
        ></input>
        <textarea
          id="input-content"
          placeholder="Post content goes here..."
          onChange={this.handleContentChange}
        ></textarea>
        <button
          id="save-post-button"
          type="submit"
          onClick={this.handleSavePost}
        >
          Save post
        </button>
      </form>
    );
  }
}

export default AddNewPost;
