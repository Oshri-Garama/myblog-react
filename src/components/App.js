import React from "react";
import Navbar from "./Navbar";
import Post from "./Post";
import SidebarItem from "./SidebarItem";
import "../styles/app.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: {
        post1: {
          id: 1,
          author: 'Israel',
          content: (
            <div>
              My <mark class="bold">first blog post</mark> is all about my
              <mark class="red"> blog post</mark> and how to write a new post in
              my blog, you can find it <a href="">here</a>
            </div>
          ),
          published: "Published 1 days ago by ",
          link: "",
        },
        post2: {
          id: 2,
          author: 'Joe',
          content: (
            <div>
              My <mark class="bold">second blog post</mark> is all about my blog
              post.
            </div>
          ),
          published: "Published 2 days ago by ",
          link: "",
        },
        post3: {
          id: 3,
          author: 'Israel',
          content: (
            <div>
              My <mark class="bold">third blog post</mark> is all about my blog
              post.
            </div>
          ),
          published: "Published 3 days ago by ",
          link: "",
        },
      },
    };
  }

  render() {
    const { post1, post2, post3 } = this.state.posts;

    return (
      <div className="page-container">
        <Navbar />
        <div className="home-container">
          <div className="blog-container">
            <header>
              <h1 id="blog-title">This is my blog</h1>
            </header>
            <Post
              id={post1.id}
              author={post1.author}
              content={post1.content}
              published={post1.published}
              link={post1.link}
            />
            <Post
              id={post2.id}
              author={post2.author}
              content={post2.content}
              published={post2.published}
              link={post2.link}
            />
            <Post
              id={post3.id}
              author={post3.author}
              content={post3.content}
              published={post3.published}
              link={post3.link}
            />
          </div>
          <div className="sidebar-container">
            <div className="latest-container">
              <SidebarItem title="Latest" posts={[post1, post2, post3]} />
            </div>
            <div className="popular-container">
              <SidebarItem title="Popular" posts={[post3, post1, post2]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
