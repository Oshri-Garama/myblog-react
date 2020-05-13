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

    const handleTitleChange = () => {
      console.log('check')
    }
  }
  render () {
    return (
      <div className='new-post-container'>
        <h1>Create New Post</h1>
        <input id='input-title' type='text' placeholder='Post title goes here...' onChange={this.handleTitleChange}></input>
        <textarea id='input-content' placeholder='Post content goes here...'></textarea>
        <button id='save-post-button' type='submit'>Save post</button>
      </div>
    )
  }
}

export default AddNewPost;
