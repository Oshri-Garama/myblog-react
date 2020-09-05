import React from "react";
import "./EditPost.css"
import axios from "axios";
import editSVG from "../../images/edit-logo.svg";
import xbuttonSVG from "../../images/icons/xbutton.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import TagsSelector from "../../components/TagsSelector/TagsSelector";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../styles/editor.css";
import { storage } from "../../firebase";
import { v4 as uuid } from "uuid";

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {
        id: props.location.state.id,
        content: "",
        title: "",
        imageUrl: "",
        image: "",
        tags: [],
      },
      popup: {
        message: null,
        isPopupOpen: false,
        success: false,
      },
      isLoading: true,
      progressUploadingImage: 0,
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

  handleContentChange = (data) => {
    this.setState({
      post: {
        ...this.state.post,
        content: data,
      },
    });
  };

  handleImageChange = (event) => {
    this.setState({
      post: {
        ...this.state.post,
        image: event.target.files[0],
      },
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { post } = this.state;
    const { image, title, content } = post;
    if (image && title && content && title.length <= 30) {
      const randomString = uuid();
      const uploadTask = storage
        .ref(`/images/${randomString}-${image.name}`)
        .put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({
            ...this.state,
            progressUploadingImage: progress,
          });
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(`${randomString}-${image.name}`)
            .getDownloadURL()
            .then((url) => {
              this.editPost(url);
            });
        }
      );
    } else {
      this.editPost();
    }
  };

  editPost = (imageUrl) => {
    const { post } = this.state;
    const { title, content } = post;
    if (imageUrl) {
      post.imageUrl = imageUrl;
    }
    if (title && content && title.length <= 30) {
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
          }, 3000);
        }
      });
    } else if (post.title.length > 30) {
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

  getSelectedTags = (tags) => {
    this.setState({
      ...this.state,
      post: {
        ...this.state.post,
        tags,
      },
    });
  };

  componentDidMount = () => {
    const { id } = this.props.location.state;
    axios.get(`/api/posts/${id}`).then((res) => {
      if (res.status === 200) {
        const { content, title, imageUrl } = res.data.post;
        const { tags } = res.data;
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
        });
      }
    });
  };

  renderTagSelector = () => {
    const { isLoading } = this.state;
    const { tags } = this.state.post;
    if (tags.length) {
      return (
        <TagsSelector
          getSelectedTags={this.getSelectedTags}
          action="update"
          tags={tags}
        />
      );
    } else if (this.state.post.tags.length === 0 && !isLoading) {
      return (
        <TagsSelector
          getSelectedTags={this.getSelectedTags}
          action="update"
          tags={[]}
        />
      );
    }
  };

  removePicture = () => {
    this.setState({
      ...this.state,
      post: {
        ...this.state.post,
        image: '',
        imageUrl: ''
      }
    })
  }

  render() {
    const { progressUploadingImage, post } = this.state;
    const { title, content, image, imageUrl } = post;
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
          <div id="ck-editor">
            <CKEditor
              data={content}
              editor={ClassicEditor}
              config={{
                removePlugins: [
                  "List",
                  "Table",
                  "MediaEmbed",
                  "BlockQuote",
                  "Indent",
                  "ImageUpload",
                ],
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                {
                  this.handleContentChange(data);
                }
              }}
            />
          </div>
          {this.renderTagSelector()}
          <div className="image-addition-input">
            <label className="upload-pic-label" for="upload">
              {image ? image.name : !imageUrl ? "Upload Picture" : "Edit Picture"}
            </label>
            <input
              type="file"
              id="upload"
              accept="image/*"
              onChange={this.handleImageChange}
              readonly
            ></input>
            {imageUrl && <img src={xbuttonSVG} title={'Click to remove picture'} onClick={this.removePicture}></img>}
          </div>
          <div
            className="progress-bar"
            style={{ "--progress": `${progressUploadingImage}%` }}
          ></div>
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
