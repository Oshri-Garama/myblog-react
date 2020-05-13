import React from "react";
import image from '../images/post.png'

export default [
  {
    id: 1,
    author: "Israel",
    title: "Being first is a pleasure",
    content: (
      <div>
        My <mark className="bold">first blog post</mark> is all about my
        <mark className="red"> blog post</mark> and how to write a new post in my
        blog.
      </div>
    ),
    published: "Published 1 days ago by ",
    link: "",
    image: image
  },
  {
    id: 2,
    author: "Joe",
    title: "All about my blog post",
    content: (
      <div>
        My <mark className="bold">second blog post</mark> is all about my blog post.
      </div>
    ),
    published: "Published 2 days ago by ",
    link: "",
    image: image
  },
  {
    id: 3,
    author: "Israel",
    title: "This is the best title ever",
    content: (
      <div>
        My <mark className="bold">third blog post</mark> is all about my blog post.
      </div>
    ),
    published: "Published 3 days ago by ",
    link: "",
    image: image
  },
];
