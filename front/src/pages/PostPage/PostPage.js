import React from "react";
import axios from "axios";

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id || "",
      post: ''
    };
  }

  componentDidMount() {
    const { id } = this.state;
    const port = '5000';
    const url = `http://localhost:${port}/posts/${id}`;
    axios.get(url).then((res) => {
      if (res.status === 200) {
        this.setState({
          post: res.data
        });
      }
    }).catch((error) => console.log(error, "Couldn't load posts"))
  }
 
  render() {
    const { post } = this.state;

    return (
      <div>
        <h1 style={{marginBottom: '0'}}>{post.title}</h1>
        <img style={{position: 'relative', top: 20, right: 0, maxWidth: 300, height: 'auto'}} src={post.imageUrl} alt="" />
        <div style={{marginTop: '50px'}}>{post.content}</div>
      </div>
    );
  }
}

export default PostPage;
