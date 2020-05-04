import React from "react";
import "../styles/post.css";
import posts from "../data/posts";

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
  }

  render() {
    const { id, author, content, published } = this.props;
    return (
      <div className="post-container">
        <h4 class="post-title">Blog post #{id}</h4>
        <div class="post-content">{content}</div>
        <div class="published-time">
          {published} {author}
        </div>
      </div>
    );
  }
}

const Posts = (props) => {
  const postsJSX = posts.map(post => {
    return (
      <Post
        id={post.id}
        author={post.author}
        content={post.content}
        published={post.published}
        link={post.link}
      />
    );
  });
  return postsJSX;
};

export default Posts
