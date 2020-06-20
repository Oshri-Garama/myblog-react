import React from 'react'
import axios from 'axios'


class Comment extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      postId: props.postId || '',
      userName: props.username || '',
      comment: ''
    }
  }

  render() {
    return (
      <div className='comment'>
          <div id='comment-user-name'>username</div>
          <div>comment</div>
      </div>
      
      )
  }
}


export default Comment
