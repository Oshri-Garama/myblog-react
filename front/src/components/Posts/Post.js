import React from 'react'
import deleteSVG from "../../images/icons/delete.svg";
import editSVG from "../../images/icons/edit.svg";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";


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
    const { id, pathname } = this.props;
    axios
      .delete("/api/posts", { data: {post_id: id} })
      .then((res) => {
        if (res.status === 200) {
          setTimeout(this.props.getAllPosts(pathname), 300);
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
        <div className="post-content-container">
          <div className="post-title-container">
            <Link className="post-title" to={`/posts/${id}`}>
              {title}
            </Link>
          </div>
          <img className='post-image' src={imageUrl} alt="" />
          <div className="post-content">{content}</div>
        </div>
        <div className="published-time">
          Published{" "}
          {daysOfPublished === 0 ? "today" : `${daysOfPublished} days ago`} by{" "}
          {author}
        </div>
        {userLoggedInId && userLoggedInId === authorId && (
          <div className="post-buttons-container">
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
              <img className="edit-post-icon" src={editSVG} />
            </Link>
            <div className="delete-post-container">
              <button className="delete-post-icon" onClick={this.handleDelete}>
                <img src={deleteSVG} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Post
