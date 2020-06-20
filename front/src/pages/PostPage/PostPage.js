import React from "react";
import axios from "axios";
import Comment from "../../components/Comment";
import "./PostPage.css";


class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || "",
      post: '',
      comment: ''
    };
  }

  componentDidMount() {
    const { id } = this.state;
    const url = `/posts/${id}`;
    axios.get(url).then((res) => {
      if (res.status === 200) {
        this.setState({
          post: res.data
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
    const {postId, username, comment} = this.state
    if (comment && username) {
      axios.post('/comments', {postId, comment}).then(res => {
        if (res.status === 200) {
          
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
          <Comment postId={id} username={this.props.username} />
        </div>
      </div>
    );
  }
}

export default PostPage;
