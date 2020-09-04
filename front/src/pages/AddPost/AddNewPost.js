import React from "react";
import "./AddNewPost.css";
import axios from "axios";
import bookSVG from "../../images/book.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import TagsSelector from "../../components/TagsSelector/TagsSelector";
import { Redirect } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../styles/editor.css";
import { storage } from "../../firebase";
import { v4 as uuid } from "uuid";

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
        tags: [],
        image: "",
      },
      popup: {
        message: null,
        isPopupOpen: false,
        success: false,
      },
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
    if (event.target.files[0]) {
      this.setState({
        post: {
          ...this.state.post,
          image: event.target.files[0],
        },
      });
    }
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { post } = this.state;
    const { image } = post;
    if (image) {
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
              this.postNew(url);
            });
        }
      );
    } else {
      this.postNew();
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

  postNew = (imageUrl) => {
    const { post } = this.state;
    const { title, content } = post;
    if (imageUrl) {
      post.imageUrl = imageUrl;
    }
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
          }, 3000);
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

  render() {
    const { isLoggedIn } = this.props;
    const { progressUploadingImage } = this.state;
    if (!isLoggedIn) return <Redirect to="/" />;
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
            readonly
          ></input>
          <div id="ck-editor">
            <CKEditor
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
          <TagsSelector getSelectedTags={this.getSelectedTags} />
          <div className="image-addition-input">
            <label className='upload-pic-label' for="upload">Upload Picture</label>
            <input
              type="file"
              id='upload'
              accept="image/*"
              onChange={this.handleImageChange}
              readonly
            ></input>
          </div>
          <progress value={progressUploadingImage} max="100" />
          <button
            id="create-post-button"
            type="submit"
            onClick={this.handleSavePost}
            disabled={success}
          >
            Create Post
          </button>
        </div>
      </form>
    );
  }
}

export default AddNewPost;
