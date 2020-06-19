import React from "react";
import "./EditPost.css";
import axios from "axios";
import { getAuthHeader } from '../../utils/requests'

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
      axios.post('/posts/edit', post, {headers: getAuthHeader()}).then(res => {
        if (res.status === 200) {
          post.published = res.data.published
          post.author = res.data.author
          alert("Post updated successfully");
          this.props.handleEditPost(post);
          this.props.history.push("/");
        }
      })
    } else {
      alert("Title and Content are required");
    }
  };

  render() {
    const { title, content, imageUrl } = this.state.post
    return (
      <form className="new-post-container" onSubmit={this.onSubmit}>
        <h1>Edit Your Post</h1>
        <input
          id="input-title"
          value={title}
          type="text"
          placeholder="Post title goes here..."
          onChange={this.handleTitleChange}
        ></input>
        <input
          id="input-title"
          value={imageUrl}
          type="url"
          placeholder="Paste here your image url"
          onChange={this.handleImageChange}
        ></input>
        <textarea
          id="input-content"
          value={content}
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

export default EditPost;
