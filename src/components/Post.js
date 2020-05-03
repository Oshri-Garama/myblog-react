import React from "react";
import "../styles/post.css";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || "",
      content: props.content || "",
      activity: props.activity || "",
      link: props.link || "",
    };
  }

  render() {
    const { id, content, activity } = this.props;
    return (
      <div className="post-container">
        <h4 class="post-title">Blog post #{id}</h4>
        <div class="post-content">{content}</div>
        <div class="published-time">{activity}</div>
      </div>
    );
  }
}

export default Post;
