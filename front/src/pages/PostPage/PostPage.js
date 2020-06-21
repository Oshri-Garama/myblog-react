import React from "react";
import axios from "axios";
import Comments from "../../components/Comment";
import "./PostPage.css";


class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || "",
      post: '',
      comment: '',
    };
  }

  componentDidMount() {
    const { id } = this.state;
    axios.get(`/posts/${id}`, { withCredentials: true }).then((res) => {
      if (res.status === 200) {
        this.setState({
          post: res.data,
        });
      }
    }).catch((error) => console.log(error, "Couldn't load posts"))
  }

  handleCommentChange = (event) => {
    this.setState({
      ...this.state,
      comment: event.target.value
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    const {id: postId, comment } = this.state
    const username = this.props.getUsername()
    if (comment && username) {
      axios.post(`/comments/${postId}`, {postId, comment}, { withCredentials: true }).then(res => {
        if (res.status === 200) {
          window.location.reload()
          console.log(res.data)
        }
      })
    } else {
      alert("Comment can not be empty");
    }
  }
 
  render() {
    const { post, id } = this.state;
    return (
      <div className='post-view'>
        <h1>{post.title}</h1>
        <img style={{maxWidth: 300, height: 'auto'}} src={post.imageUrl} alt="" />
        <div className='post-view-content'>{post.content}</div>
        <form className='comment-input-container' onSubmit={this.onSubmit}>
          <textarea id='comment-inputarea' onChange={this.handleCommentChange}></textarea>
          <button id='comment-button'>Comment</button>
        </form>
        <div id='comments-container'>
          <h3>Comments</h3>
          <Comments postId={id} />
        </div>
      </div>
    );
  }
}

export default PostPage;
