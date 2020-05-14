import React from 'react'
import './AddNewPost.css'

class AddNewPost extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      post: {
        content: '',
        title: ''
      }
    }
  }
  handleTitleChange = (event) => {
    this.setState({
      post: {
        ...this.state.post,
        title: event.target.value
      }
    })
  }

  handleContentChange = (event) => {
    this.setState({
      post: {
        ...this.state.post,
        content: event.target.value
      }
    })
  }

  handleSavePost = (event) => {
    const { post } = this.state;
    this.props.handleAddPost(post);
  }

  render () {
    return (
      <div className='new-post-container'>
        <h1>Create New Post</h1>
        <input id='input-title' type='text' placeholder='Post title goes here...' onChange={this.handleTitleChange}></input>
        <textarea id='input-content' placeholder='Post content goes here...' onChange={this.handleContentChange}></textarea>
        <button id='save-post-button' type='submit' onClick={this.handleSavePost}>Save post</button>
      </div>
    )
  }
}

export default AddNewPost;
