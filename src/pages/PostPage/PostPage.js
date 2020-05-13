import React from 'react'

class PostPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.match.params.id || '',
    }
  }

  render () {
    const { id } = this.state;
    const { posts } = this.props;
    const currentPost = posts.find(post => post.id == id)
    return (
      <div>
        <h1>{currentPost.title}</h1>
        <div>{currentPost.content}</div>
      </div>
    )
  }
}


export default PostPage;
