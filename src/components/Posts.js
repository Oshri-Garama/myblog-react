import React from "react";
import "../styles/post.css";
import { Link } from 'react-router-dom'

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || "",
      author: props.author || "",
      content: props.content || "",
      published: props.published || "",
      image: props.image || "",
    };
  }

  render() {
    const {id, author, title, content, image, published } = this.props;
    return (
      <div className="post-container">
        <h4 class="post-title"><Link to={`/posts/${id}`}>{title}</Link></h4>
        <div class="post-content">{content}</div>
        <div class="published-time">
          {published} {author}
        </div>
        <img className="image-container" src={image} alt="" />
      </div>
    );
  }
}

const Posts = (props) => {
  const postsJSX = props.posts.map((post) => {
    return (
      <Post
        id={post.id}
        author={post.author}
        title={post.title}
        content={post.content}
        published={post.published}
        image={post.image}
      />
    );
  });
  return postsJSX;
};

export default Posts;
