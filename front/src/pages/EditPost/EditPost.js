import React from "react";
import "./EditPost.css";
import axios from "axios";
import editSVG from "../../images/edit-logo.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import TagsSelector from "../../components/TagsSelector/TagsSelector";

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        id: props.location.state.id,
        content: "",
        title: "",
        imageUrl: "",
        tags: []
      },
      popup: {
        message: null,
        isPopupOpen: false,
        success: false,
      },
      isLoading: true
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
      axios.put("/api/posts", post).then((res) => {
        if (res.status === 200) {
          post.published = res.data.post.published;
          post.author = res.data.post.author;
          this.setState({
            ...this.state,
            popup: {
              message: "Post updated successfully",
              isPopupOpen: true,
              success: true,
            },
          });
          setTimeout(() => {
            this.props.history.push(`/posts/${post.id}`);
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

  getSelectedTags = (tags) => {
    this.setState({
      ...this.state,
      post: {
        ...this.state.post,
        tags
      }
    })
  }

  componentDidMount = () => {
    const { id } = this.props.location.state
    axios.get(`/api/posts/${id}`).then(res => {
      if (res.status === 200) {
        const { content, title, imageUrl } = res.data.post
        const { tags } = res.data
        this.setState({
          ...this.state,
          post: {
            ...this.state.post,
            tags,
            content,
            title,
            imageUrl,
          },
          isLoading: false,
        })
      }
    })
  }

  renderTagSelector = () => {
    const { isLoading } = this.state
    if (this.state.post.tags.length) {
      const { tags } = this.state.post
      return (
        <TagsSelector getSelectedTags={this.getSelectedTags} updatePost={true} tags={tags} />
      )
    }
    else if (this.state.post.tags.length === 0 && !isLoading) {
      return (
        <TagsSelector getSelectedTags={this.getSelectedTags} updatePost={true} tags={[]} />
      )
    }
  }

  render() {
    const {id, title, content, imageUrl, tags } = this.state.post;
    const { message, success } = this.state.popup;
    const type = success ? "success" : "failed";
    this.closePopupIfOpen();
    console.log('this.state', this.props)
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
          {this.renderTagSelector()}
          <button
            id="create-post-button"
            type="submit"
            onClick={this.handleSavePost}
            disabled={success}
          >
            Update Post
          </button>
        </div>
      </form>
    );
  }
}

export default EditPost;
