import React from "react";
import "../styles/post.css";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || "",
      author: props.author || "",
      content: props.content || "",
      published: props.published || "",
      link: props.link || "",
    };

    function Posts(props) {
      
    }
  }

  render() {
    const { id, author, content, published } = this.props;
    return (
      <div className="post-container">
        <h4 class="post-title">Blog post #{id}</h4>
        <div class="post-content">{content}</div>
        <div class="published-time">{published} {author}</div>
      </div>
    );
  }
}

export default Post;
