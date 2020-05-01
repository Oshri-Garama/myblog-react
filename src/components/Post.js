import React from "react";
import '../styles/post.css'

const Post = (props) => {
  return (
    <div className="post-container">
      <h4 class="post-title">Blog post #{props.id}</h4>
      <div class="post-content">
        {props.content}
      </div>
      <div class="published-time">Published 1 days ago by Israel</div>
    </div>
  );
};

export default Post;
