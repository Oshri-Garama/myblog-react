import React from "react";
import posts from "../data/posts";

class SidebarItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title || "",
      posts: props.posts || [],
    };
  }

  render() {
    const [
      firstSidebarPost,
      secondSidebarPost,
      thirdSidebarPost,
    ] = this.props.posts;

    return (
      <div>
        <header>
          <h1>{this.props.title}</h1>
        </header>
        <h4>
          Blog post #{firstSidebarPost.id}{" "}
          <a href={firstSidebarPost.link}>go to page</a>
        </h4>
        <h4>
          Blog post #{secondSidebarPost.id}{" "}
          <a href={secondSidebarPost.link}>go to page</a>
        </h4>
        <h4>
          Blog post #{thirdSidebarPost.id}{" "}
          <a href={thirdSidebarPost.link}>go to page</a>
        </h4>
      </div>
    );
  }
}

const Sidebar = (props) => {
  const [post1, post2, post3] = posts;
  return (
    <div className="sidebar-container">
      <div className="latest-container">
        <SidebarItem title="Latest" posts={[post1, post2, post3]} />
      </div>
      <div className="popular-container">
        <SidebarItem title="Popular" posts={[post3, post1, post2]} />
      </div>
    </div>
  );
};

export default Sidebar;
