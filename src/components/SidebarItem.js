import React from "react";

const SidebarItem = (props) => {
  return (
    <div>
      <header>
        <h1>{props.title}</h1>
      </header>
      <h4>
        Blog post #1 <a href="">go to page</a>
      </h4>
      <h4>
        Blog post #2 <a href="">go to page</a>
      </h4>
      <h4>
        Blog post #3 <a href="">go to page</a>
      </h4>
    </div>
  );
};

export default SidebarItem;
