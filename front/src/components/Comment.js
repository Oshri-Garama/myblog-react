import React from "react";
import axios from "axios";

const Comment = (props) => {
  return (
    <div className="comment">
      <div id="comment-user-name">{props.username}</div>
      <div>{props.comment}</div>
    </div>
  );
}

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: props.postId,
      comments: []
    };
  }

  componentDidMount = () => {
    const { postId } = this.state;
    axios
      .get(`/comments/${postId}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            comments: res.data,
          });
        }
      })
      .catch((error) => console.log(error, "Couldn't load comments"));
  };

  render() {
    const commentsJSX = this.state.comments.map(commentData => {
      return (
        <Comment
          username={commentData.username}
          comment={commentData.content}
        />
      );
    });
    return commentsJSX;
  }
}

export default Comments;
