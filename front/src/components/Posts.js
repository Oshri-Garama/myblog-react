import React from "react";
import "../styles/post.css";
import { Link } from "react-router-dom";
import Image from 'react-image-resizer';
import moment from 'moment';


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
  getFormattedDate = date => {
    const dateObj = moment.utc(new Date(date)).format('YYYY-MM-DD')
    return dateObj;
  }

  render() {
    const { id, author, title, content, image, published } = this.props;
    const publishedDate = this.getFormattedDate(published)
    const daysOfPublished = moment().diff(publishedDate, 'days')

    return (
      <div className="post-container">
        <h4 className="post-title">
          <Link to={`/posts/${id}`}>{title}</Link>
        </h4>
        <div className="post-content">{content}</div>
        <div className="published-time">
           Published {daysOfPublished === 0 ? 'today' : `${daysOfPublished} days ago`} by {author}
        </div>
        <div className="image-container"> 
          <Image src={image} alt="" height='130' width='300' />
        </div>
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
