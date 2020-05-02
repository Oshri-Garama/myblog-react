import React from "react";

class SidebarItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title || "",
      posts: props.posts || []
    };
  }

  render() {
    const [ firstSidebarPost, secondSidebarPost , thirdSidebarPost ] = this.props.posts;

      return (
        <div>
          <header>
            <h1>{this.props.title}</h1>
          </header>
          <h4>
            Blog post #{firstSidebarPost.id} <a href={firstSidebarPost.link}>go to page</a>
          </h4>
          <h4>
            Blog post #{secondSidebarPost.id} <a href={secondSidebarPost.link}>go to page</a>
          </h4>
          <h4>
            Blog post #{thirdSidebarPost.id} <a href={thirdSidebarPost.link}>go to page</a>
          </h4>
        </div>
      );
  }
}

export default SidebarItem;
