import React, { useState } from 'react'
import deleteSVG from "../../images/icons/delete.svg";
import editSVG from "../../images/icons/edit.svg";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import { fromHTMLtoString } from '../../utils/utils'
import { useTranslation } from "react-i18next";

const Post = (props) => {
  const {
    id,
    userLoggedInId,
    author,
    authorId,
    title,
    content,
    imageUrl,
    published,
  } = props;


  const getFormattedDate = (date) => {
    const dateObj = moment.utc(new Date(date)).format("YYYY-MM-DD");
    return dateObj;
  };

  const publishedDate = getFormattedDate(published);
  const daysOfPublished = moment().diff(publishedDate, "days");
  const { t, i18n } = useTranslation();

  const handleDelete = () => {
    const answer = window.confirm(t('deletePostConfirmation'));
    if (!answer) return;
    axios
      .delete("/api/posts", { data: {post_id: id} })
      .then((res) => {
        if (res.status === 200) {
          setTimeout(props.getAllPosts(props.pathname), 300);
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          console.log(
            err,
            "The post you are trying to delete is not exist in the database"
          );
        }
      });
  };
  

  return (
    <div className="post-container">
      <div className="post-content-container">
        <div className="post-title-container">
          <Link className="post-title" to={`/posts/${id}`}>
            {title}
          </Link>
        </div>
        {imageUrl && <img className='post-image' src={imageUrl} alt="" />}
        <div className={imageUrl ? "post-content min-content-lines" : "post-content"}>{fromHTMLtoString(`${content}`)}</div>
      </div>
      <div className={i18n.language === 'he' ? "published-time published-time-hebrew" : "published-time"}>
        {t('published')}{" "}
        {daysOfPublished === 0 ? t('today') : i18n.language === 'he' ? `${t('before')} ${daysOfPublished} ${t('days')}` : `${daysOfPublished} ${t('daysAgo')}`} {t('by')}{" "}
        {author}
      </div>
      {userLoggedInId && userLoggedInId === authorId && (
        <div className="post-buttons-container">
          <Link
            to={{
              pathname: `/posts/edit/${id}`,
              state: {
                id: id,
                title: title,
                content: content,
                imageUrl: imageUrl,
              },
            }}
            className='edit-post-icon'
          >
            <img style={{width: '100%'}} src={editSVG} />
          </Link>
          <div className="delete-post-container">
            <button className="delete-post-icon" onClick={handleDelete}>
              <img style={{width: '100%'}} src={deleteSVG} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post
