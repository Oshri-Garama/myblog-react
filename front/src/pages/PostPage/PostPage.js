import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Comments from "../../components/Comment";
import "./PostPage.css";
import commentSVG from "../../images/icons/comment.svg";
import { Link } from "react-router-dom";
import Scrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { lang } from "moment";


const PostPage = (props) => {
  const [id] = useState(props.match.params.id);
  const [isLoggedIn] = useState(props.isLoggedIn);
  const [post, setPost] = useState({});
  const [comment, setComment] = useState("");
  const [username] = useState(props.username);
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [popup, setPopup] = useState({
    message: null,
    isPopupOpen: false,
    success: false,
  });
  const { t, i18n } = useTranslation()

  const formRef = useRef(null);
  const comp = useRef(null);
  const ps = useRef(null);

  const fetchPostPage = () => {
    axios
      .get(`/api/posts/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setPost(res.data.post);
          setComments(res.data.comments);
          setTags(res.data.tags);
        }
      })
      .catch((error) => console.log(error, "Couldn't load posts"));
  };

  useEffect(() => {
    fetchPostPage();
    ps.current = new Scrollbar(comp.current);
  }, [ps]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const postId = id;

    if (comment && username) {
      axios
        .post(
          `/api/comments/${postId}`,
          { postId, comment },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            setPopup({
              message: t('commentSuccess'),
              isPopupOpen: true,
              success: true,
            });
            setComment("");
            fetchPostPage();
            formRef.current.reset();
          }
        });
    } else {
      setPopup({
        message: t('emptyCommentError'),
        isPopupOpen: true,
        success: false,
      });
    }
  };

  const renderPostImage = () => {
    if (post.imageUrl)
      return <img id="post-image-post-page" src={post.imageUrl} />;
    return null;
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

  const renderTags = () => {
    const tagsJSX = tags.map((tag) => {
      return (
        <div className="tag-label" key={parseInt(tag.id)}>
          #{tag.name}
        </div>
      );
    });
    return <div id="tags-container">{tagsJSX}</div>;
  };

  const renderContent = () => {
    const contentParsedToString = parse(`${post.content}`);
    return <div className="post-view-content">{contentParsedToString}</div>;
  };

  const { message, success, isPopupOpen } = popup;
  const type = success ? "success" : "failed";
 
  return (
    <div className="post-view-page">
      <AlertMessage message={message} type={type} />
      <header id="post-view-title">{post.title}</header>
      <div className="post-view-container">
        <div id="post-page-seperator">
          {renderPostImage()}
          {renderContent()}
          {renderTags()}
        </div>
        <form
          className="comment-input-container"
          onSubmit={onSubmit}
          disabled={!isLoggedIn}
          ref={formRef}
        >
          <textarea
            className="comment-inputarea"
            placeholder={t('commentPlaceholder')}
            onChange={handleCommentChange}
            disabled={!isLoggedIn}
            dir={i18n.language === "he" ? "rtl" : "ltr"}
            ></textarea>
          <button
            id="comment-button"
            disabled={(!isLoggedIn || isPopupOpen) && success}
          >
            <img id="comment-icon" src={commentSVG} />
          </button>
          <div id="comments-container">
            {!isLoggedIn && (
              <section id="comment-unlogged-error">
                {t('toCommentYouMust')}{" "}
                <Link
                  className="comment-section-link"
                  to={{
                    pathname: "/login",
                    state: {
                      from: props.location,
                    },
                  }}
                >
                  {i18n.language === "he" ? t('toLogin') : t('login')}
                </Link>{" "}
                {t('or')}{" "}
                <Link
                  className="comment-section-link"
                  to={{
                    pathname: "/signup",
                    state: {
                      from: props.location,
                    },
                  }}
                >
                  {i18n.language === "he" ? t('toSignup') : t('signUp')}
                </Link>
              </section>
            )}
            <header id="post-view-comments-header">{t('comments')}</header>
            <div id="comments-list" ref={comp}>
              <Comments comments={comments} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
