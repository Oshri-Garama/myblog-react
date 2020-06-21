import React from "react";
import "../styles/post.css";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";


class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || "",
      author: props.author || "",
      content: props.content || "",
      published: props.published || "",
      imageUrl: props.imageUrl || "",
    };
  }
  getFormattedDate = (date) => {
    const dateObj = moment.utc(new Date(date)).format("YYYY-MM-DD");
    return dateObj;
  };

  handleDelete = () => {
    const answer = window.confirm("Are you sure you want to delete this post?");
    if (!answer) return;
    const { id, handleDeletePost } = this.props;
      axios
        .post("/posts/delete", { post_id: id })
        .then((res) => {
          if (res.status === 200) {
            handleDeletePost();
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

  render() {
    const {
      id,
      userLoggedInId,
      author,
      authorId,
      title,
      content,
      imageUrl,
      published,
    } = this.props;
    const publishedDate = this.getFormattedDate(published);
    const daysOfPublished = moment().diff(publishedDate, "days");

    return (
      <div className="post-container">
        <div className="seperate-image-container">
          <h4 className="post-title">
            <Link to={`/posts/view/${id}`}>{title}</Link>
          </h4>
          <div className="post-content">{content}</div>
          <div className="published-time">
            Published{" "}
            {daysOfPublished === 0 ? "today" : `${daysOfPublished} days ago`} by{" "}
            {author}
          </div>
        </div>
        <div className="right-side-container">
          <img
            style={{ alignSelf: "flex-end", maxWidth: 150, height: "auto" }}
            src={imageUrl}
            alt=""
          />
          {userLoggedInId && userLoggedInId === authorId && (
            <div className="buttons-container">
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
              >
                Edit
              </Link>
              <button className="buttons" onClick={this.handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const Posts = (props) => {
  const { isLoggedIn, userId, handleDeletePost } = props;
  const postsJSX = props.posts.map((post) => {
    return (
      <Post
        id={post.id}
        author={post.author}
        authorId={post.authorId}
        title={post.title}
        content={post.content}
        published={post.published}
        imageUrl={post.imageUrl}
        userLoggedInId={isLoggedIn ? userId : null}
        handleDeletePost={handleDeletePost}
      />
    );
  });
  return postsJSX;
};

export default Posts;
