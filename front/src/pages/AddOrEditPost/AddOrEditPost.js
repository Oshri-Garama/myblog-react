import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./AddNewPost.css";
import "./EditPost.css"
import axios from "axios";
import bookSVG from "../../images/book.svg";
import editSVG from "../../images/edit-logo.svg";
import xbuttonSVG from "../../images/icons/xbutton.svg";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import TagsSelector from "../../components/TagsSelector/TagsSelector";
import { Redirect } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../styles/editor.css";
import { storage } from "../../firebase";
import { v4 as uuid } from "uuid";


const AddOrEditPost = (props) => {
  const [isLoggedIn] = useState(props.isLoggedIn);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState("");
  const [popup, setPopup] = useState({
    message: null,
    isPopupOpen: false,
    success: false,
  });
  const [progressUploadingImage, setProgressUploadingImage] = useState(0);
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language);
  const [location] = useState(props.location.state);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPost, setIsNewPost] = useState(true);


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

  const newPost = (newImageUrl) => {
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
              if (!location || (!location && !location.id)) {
                newPost(url);
              }
              else {
                editPost(url);
              }
            });
        }
      );
    } else {
      if (!location || (!location && !location.id)) {
        newPost();
      }
      else {
        editPost();
      }
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

  useEffect(() => {
    if (props && props.location && props.location.state) {
      setIsNewPost(false)
      const { id } = props.location.state
      axios.get(`/api/posts/${id}`).then(res => {
        if (res.status === 200) {
          const { content, title, imageUrl } = res.data.post;
          const { tags } = res.data;
          setTags(tags)
          setContent(content)
          setTitle(title)
          setImageUrl(imageUrl)
          setIsLoading(false)
        }
      })
    }
  }, []);

  const getSelectedTags = (tags) => {
    setTags(tags)
  };

  const removePicture = () => {
    setImage("")
  };

  useEffect(() => {
    if (language !== i18n.language) {
      setLanguage(i18n.language)
    }
  },[language, i18n.language])

  const editPost = (imageUrl) => {
    const post = {
      content: content,
      imageUrl: imageUrl || "",
      title: title,
      tags: tags,
      id: props.location.state.id
    }
    if (imageUrl) {
      post.imageUrl = imageUrl;
    }
    if (title && content && title.length <= 30) {
      axios.put("/api/posts", post).then((res) => {
        if (res.status === 200) {
          post.published = res.data.post.published;
          post.author = res.data.post.author;
          setPopup({
            message: "Post updated successfully",
            isPopupOpen: true,
            success: true,
          })
          setTimeout(() => {
            props.history.push(`/posts/${post.id}`);
          }, 3000);
        }
      });
    } else if (post.title.length > 30) {
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

  const renderTagSelector = () => {
    if (tags.length) {
      return (
        <TagsSelector
          getSelectedTags={getSelectedTags}
          action="update"
          tags={tags}
        />
      );
    } else if (tags.length === 0 && !isLoading) {
      return (
        <TagsSelector
          getSelectedTags={getSelectedTags}
          action="update"
          tags={[]}
        />
      );
    }
  };

  const renderNewPostPage = () => {
    const { message, success } = popup;
    const type = success ? "success" : "failed";
    return (
      <form className="new-post-container" onSubmit={onSubmit}>
        <AlertMessage message={message} type={type} />
        <header id="create-new-post-title">{t('addNewPostTitle')}</header>
        <div id="new-post-form-container">
          <img id="icon-header-new-post" src={bookSVG} />
          <input
            id="input-add-title"
            type="text"
            placeholder={t('titlePlaceholder')}
            onChange={handleTitleChange}
            readonly
            dir={i18n.language === "he" ? 'rtl' : 'ltr'}
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
            <label className={i18n.language === "he" ? "upload-pic-label upload-pic-label-hebrew" : "upload-pic-label"} for="upload">
              {image ? image.name : t('uploadPicture')}
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
            className="create-post-button"
            type="submit"
            disabled={success}
          >
            {t('createPost')}
          </button>
        </div>
      </form>
    );
  }

  const renderEditPostPage = () => {
    const { message, success } = popup;
    const type = success ? "success" : "failed";

    return (
      <form className="new-post-container" onSubmit={onSubmit}>
        <AlertMessage message={message} type={type} />
        <header id="create-new-post-title">Edit Your Post</header>
        <div id="new-post-form-container" className="edit-post-container">
          <img id="edit-post-logo" src={editSVG} />
          <input
            id="input-add-title"
            value={title}
            type="text"
            placeholder="Post title goes here..."
            onChange={handleTitleChange}
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
                  handleContentChange(data);
                }
              }}
            />
          </div>
          {renderTagSelector()}
          <div className="image-addition-input">
            <label className="upload-pic-label" for="upload">
              {image ? image.name : !imageUrl ? "Upload Picture" : "Edit Picture"}
            </label>
            <input
              type="file"
              id="upload"
              accept="image/*"
              onChange={handleImageChange}
              readonly
            ></input>
            {(imageUrl || image) && <img className='x-button' src={xbuttonSVG} title={'Click to remove picture'} onClick={removePicture}></img>}
          </div>
          <div
            className="progress-bar"
            style={{ "--progress": `${progressUploadingImage}%` }}
          ></div>
          <button
            className="create-post-button"
            type="submit"
            disabled={success}
          >
            Update Post
          </button>
        </div>
      </form>
    );
  }


    if (!isLoggedIn) return <Redirect to="/" />;
    if (isNewPost) {
      return renderNewPostPage()
    }
    else {
      return renderEditPostPage()
    }
    
};

export default AddOrEditPost;
