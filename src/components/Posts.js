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
      link: props.link || "",
      image: props.image || "",
    };
  }

  render() {
    const { id, author, content, image, published } = this.props;
    return (
      <div className="post-container">
        <h4 class="post-title"><Link to={`/posts/${id}`}>Blog post #{id}</Link></h4>
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
        content={post.content}
        published={post.published}
        link={post.link}
        image={post.image}
      />
    );
  });
  return postsJSX;
};

export default Posts;
