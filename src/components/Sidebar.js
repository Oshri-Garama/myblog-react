import React from "react";

class SidebarItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title || "",
      posts: props.posts || [],
    };
  }

  render() {

    return (
      <div>
        <header>
          <h1>{this.props.title}</h1>
        </header>
        <h4>
          Blog post #1{" "}
          <a href=''>go to page</a>
        </h4>
        <h4>
          Blog post #2{" "}
          <a href='/'>go to page</a>
        </h4>
        <h4>
          Blog post #3{" "}
          <a href='/'>go to page</a>
        </h4>
      </div>
    );
  }
}

const Sidebar = (props) => {

  return (
    <div className="sidebar-container">
      <div className="latest-container">
        <SidebarItem title="Latest" posts={props.posts} />
      </div>
      <div className="popular-container">
        <SidebarItem title="Popular" posts={props.posts} />
      </div>
    </div>
  );
};

export default Sidebar;
