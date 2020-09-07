import React, { useState, useEffect, useRef } from "react";
import "./AddNewPost.css";
import axios from "axios";
import bookSVG from "../../images/book.svg";
import xbuttonSVG from "../../images/icons/xbutton.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import TagsSelector from "../../components/TagsSelector/TagsSelector";
import { Redirect } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../styles/editor.css";
import { storage } from "../../firebase";
import { v4 as uuid } from "uuid";

const AddNewPost = (props) => {
  const [id, setId] = useState("");
  const [isLoggedIn] = useState(props.isLoggedIn);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState("");
  const [popup, setPopup] = useState({
    message: null,
    isPopupOpen: false,
    success: false,
  });
  const [progressUploadingImage, setProgressUploadingImage] = useState(0);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (data) => {
    setContent(data);
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const postNew = (newImageUrl) => {
    const post = {
      content: content,
      imageUrl: imageUrl,
      title: title,
      tags: tags
    }
    if (newImageUrl) {
      post.imageUrl = newImageUrl
    }
    if (title && content && title.length <= 30) {
      axios.post("/api/posts", post).then((res) => {
        if (res.status === 200) {
          post.published = res.data.post.published;
          post.id = res.data.post.id;
          post.author = res.data.post.author;
          setPopup({
            message: "Post saved successfully",
            isPopupOpen: true,
            success: true,
          })
          setTimeout(() => {
            props.history.push(`/posts/${post.id}`);
          }, 3000);
        }
        if (!image) {
          setProgressUploadingImage(100)
        }
      });
    } else if (title.length > 30) {
      setPopup({
        message: "Title must be 30 letters max",
        isPopupOpen: true,
        success: false,
      })
    } else {
      setPopup({
        message: "Title and Content are required",
        isPopupOpen: true,
        success: false,
      })
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
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
          setProgressUploadingImage(progress);
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
              postNew(url);
            });
        }
      );
    } else {
      postNew();
    }
  };

  useEffect(() => {
    if (popup.isPopupOpen) {
      setTimeout(() => {
        setPopup({
          isPopupOpen: false,
          message: null,
        });
      }, 4000);
    }
  }, [popup]);

  const getSelectedTags = (tags) => {
    setTags(tags)
  };

  const removePicture = () => {
    setImage("")
  };

    if (!isLoggedIn) return <Redirect to="/" />;
    const { message, success } = popup;
    const type = success ? "success" : "failed";
    return (
      <form className="new-post-container" onSubmit={onSubmit}>
        <AlertMessage message={message} type={type} />
        <header id="create-new-post-title">Create New Post</header>
        <div id="new-post-form-container">
          <img id="icon-header-new-post" src={bookSVG} />
          <input
            id="input-add-title"
            type="text"
            placeholder="Post title goes here..."
            onChange={handleTitleChange}
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
                  handleContentChange(data);
                }
              }}
            />
          </div>
          <TagsSelector getSelectedTags={getSelectedTags} />
          <div className="image-addition-input">
            <label className="upload-pic-label" for="upload">
              {image ? image.name : "Upload Picture"}
            </label>
            <input
              type="file"
              id="upload"
              accept="image/*"
              onChange={handleImageChange}
              readonly
            ></input>
            {image && (
              <img
                src={xbuttonSVG}
                className="x-button"
                title={"Click to remove picture"}
                onClick={removePicture}
              ></img>
            )}
          </div>
          <div
            className="progress-bar"
            style={{ "--progress": `${progressUploadingImage}%` }}
          ></div>
          <button
            id="create-post-button"
            type="submit"
            // onClick={handleSavePost}
            disabled={success}
          >
            Create Post
          </button>
        </div>
      </form>
    );
};

// class AddNewPost extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       post: {
//         id: "",
//         content: "",
//         title: "",
//         imageUrl: "",
//         author: "",
//         tags: [],
//         image: "",
//       },
//       popup: {
//         message: null,
//         isPopupOpen: false,
//         success: false,
//       },
//       progressUploadingImage: 0,
//     };
//   }
//   handleTitleChange = (event) => {
//     this.setState({
//       post: {
//         ...this.state.post,
//         title: event.target.value,
//       },
//     });
//   };

//   handleContentChange = (data) => {
//     this.setState({
//       post: {
//         ...this.state.post,
//         content: data,
//       },
//     });
//   };

//   handleImageChange = (event) => {
//     if (event.target.files[0]) {
//       this.setState({
//         post: {
//           ...this.state.post,
//           image: event.target.files[0],
//         },
//       });
//     }
//   };

//   onSubmit = async (event) => {
//     event.preventDefault();
//     const { post } = this.state;
//     const { image, title, content } = post;
//     if (image && title && content && title.length <= 30) {
//       const randomString = uuid();
//       const uploadTask = storage
//         .ref(`/images/${randomString}-${image.name}`)
//         .put(image);
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = Math.round(
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//           );
//           this.setState({
//             ...this.state,
//             progressUploadingImage: progress,
//           });
//         },
//         (error) => {
//           console.log(error);
//         },
//         () => {
//           storage
//             .ref("images")
//             .child(`${randomString}-${image.name}`)
//             .getDownloadURL()
//             .then((url) => {
//               this.postNew(url);
//             });
//         }
//       );
//     } else {
//       this.postNew();
//     }
//   };

//   closePopupIfOpen = () => {
//     const { isPopupOpen } = this.state.popup;
//     if (isPopupOpen) {
//       setTimeout(() => {
//         this.setState({
//           ...this.state,
//           popup: {
//             isPopupOpen: false,
//             message: null,
//           },
//         });
//       }, 4000);
//     }
//   };

//   getSelectedTags = (tags) => {
//     this.setState({
//       ...this.state,
//       post: {
//         ...this.state.post,
//         tags,
//       },
//     });
//   };

//   postNew = (imageUrl) => {
//     const { post } = this.state;
//     const { title, content } = post;
//     if (imageUrl) {
//       post.imageUrl = imageUrl;
//     }
//     if (title && content && title.length <= 30) {
//       axios.post("/api/posts", post).then((res) => {
//         if (res.status === 200) {
//           post.published = res.data.post.published;
//           post.id = res.data.post.id;
//           post.author = res.data.post.author;
//           this.setState({
//             ...this.state,
//             popup: {
//               message: "Post saved successfully",
//               isPopupOpen: true,
//               success: true,
//             },
//           });
//           setTimeout(() => {
//             this.props.history.push(`/posts/${post.id}`);
//           }, 3000);
//         }
//         if (!post.image) {
//           this.setState({
//             ...this.state,
//             progressUploadingImage: 100,
//           });
//         }
//       });
//     } else if (title.length > 30) {
//       this.setState({
//         ...this.state,
//         popup: {
//           message: "Title must be 30 letters max",
//           isPopupOpen: true,
//           success: false,
//         },
//       });
//     } else {
//       this.setState({
//         ...this.state,
//         popup: {
//           message: "Title and Content are required",
//           isPopupOpen: true,
//           success: false,
//         },
//       });
//     }
//   };

//   removePicture = () => {
//     this.setState({
//       ...this.state,
//       post: {
//         ...this.state.post,
//         image: "",
//       },
//     });
//   };

//   render() {
//     const { isLoggedIn } = this.props;
//     const { progressUploadingImage, post } = this.state;
//     const { image } = post;
//     if (!isLoggedIn) return <Redirect to="/" />;
//     const { message, success } = this.state.popup;
//     const type = success ? "success" : "failed";
//     this.closePopupIfOpen();
//     return (
//       <form className="new-post-container" onSubmit={this.onSubmit}>
//         <AlertMessage message={message} type={type} />
//         <header id="create-new-post-title">Create New Post</header>
//         <div id="new-post-form-container">
//           <img id="icon-header-new-post" src={bookSVG} />
//           <input
//             id="input-add-title"
//             type="text"
//             placeholder="Post title goes here..."
//             onChange={this.handleTitleChange}
//             readonly
//           ></input>
//           <div id="ck-editor">
//             <CKEditor
//               editor={ClassicEditor}
//               config={{
//                 removePlugins: [
//                   "List",
//                   "Table",
//                   "MediaEmbed",
//                   "BlockQuote",
//                   "Indent",
//                   "ImageUpload",
//                 ],
//               }}
//               onChange={(event, editor) => {
//                 const data = editor.getData();
//                 {
//                   this.handleContentChange(data);
//                 }
//               }}
//             />
//           </div>
//           <TagsSelector getSelectedTags={this.getSelectedTags} />
//           <div className="image-addition-input">
//             <label className="upload-pic-label" for="upload">
//               {image ? image.name : "Upload Picture"}
//             </label>
//             <input
//               type="file"
//               id="upload"
//               accept="image/*"
//               onChange={this.handleImageChange}
//               readonly
//             ></input>
//             {image && (
//               <img
//                 src={xbuttonSVG}
//                 className="x-button"
//                 title={"Click to remove picture"}
//                 onClick={this.removePicture}
//               ></img>
//             )}
//           </div>
//           <div
//             className="progress-bar"
//             style={{ "--progress": `${progressUploadingImage}%` }}
//           ></div>
//           <button
//             id="create-post-button"
//             type="submit"
//             onClick={this.handleSavePost}
//             disabled={success}
//           >
//             Create Post
//           </button>
//         </div>
//       </form>
//     );
//   }
// }

export default AddNewPost;
