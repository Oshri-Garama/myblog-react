import React from "react";

const Comment = (props) => {
  return (
    <div className="comment-container">
      <div className="comment-user-name">{props.username}</div>
      <div className='comment-comment-content'>{props.comment}</div>
    </div>
  );
}

const Comments = (props) => {
    const commentsJSX = props.comments.map(commentData => {
      return (
        <Comment
          username={commentData.username}
          comment={commentData.content}
          key={commentData.commentId}
        />
      );
    });
    return commentsJSX;
}

export default Comments;
