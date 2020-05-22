import React from "react";

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || "",
    };
  }

  render() {
    const { id } = this.state;
    const { posts } = this.props;
    const currentPost = posts.find((post) => post.id == id);
    return (
      <div>
        {console.log(currentPost)}
        <h1 style={{marginBottom: '0'}}>{currentPost.title}</h1>
        <img style={{position: 'relative', top: 20, right: 0, maxWidth: 300, height: 'auto'}} src={currentPost.image} alt="" />
        <div style={{marginTop: '50px'}}>{currentPost.content}</div>
      </div>
    );
  }
}

export default PostPage;
