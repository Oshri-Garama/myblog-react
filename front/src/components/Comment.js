import React from "react";
import axios from "axios";

const Comment = (props) => {
  return (
    <div className="comment">
      <div id="comment-user-name">{props.username}</div>
      <div>{props.comment}</div>
    </div>
  );
}

const Comments = (props) => {
    const commentsJSX = props.comments.map(commentData => {
      return (
        <Comment
          username={commentData.username}
          comment={commentData.content}
        />
      );
    });
    return commentsJSX;
}

export default Comments;
