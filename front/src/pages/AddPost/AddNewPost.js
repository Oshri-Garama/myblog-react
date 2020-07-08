import React from "react";
import "./AddNewPost.css";
import axios from "axios";
import bookSVG from '../../images/book.svg'

// const port = '5000';
// const url = `http://ec2-54-209-175-208.compute-1.amazonaws.com:${port}/posts`;

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
    if (post.title && post.content && (post.title.length <= 30)) {
      axios.post("/api/posts", post).then((res) => {
        if (res.status === 200) {
          post.published = res.data.published;
          post.id = res.data.id;
          post.author = res.data.author;
          alert("Post saved successfully");
          this.props.history.push("/posts");
        }
      });
    } else if (post.title.length > 30) {
      console.log('here')
      alert("Title must be 30 letters max");
    }
    else {
      alert("Title and Content are required");
    }
  };

  render() {
    return (
      <form className="new-post-container" onSubmit={this.onSubmit}>
        <header id="create-new-post-title">Create New Post</header>
        <div id='new-post-form-container'>

        <img id='icon-header-new-post' src={bookSVG}/>
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
