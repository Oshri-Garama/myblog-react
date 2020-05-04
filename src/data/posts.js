import React from "react";
import image from '../images/post.png'

export default [
  {
    id: 1,
    author: "Israel",
    content: (
      <div>
        My <mark class="bold">first blog post</mark> is all about my
        <mark class="red"> blog post</mark> and how to write a new post in my
        blog, you can find it <a href="">here</a>
      </div>
    ),
    published: "Published 1 days ago by ",
    link: "",
    image: image
  },
  {
    id: 2,
    author: "Joe",
    content: (
      <div>
        My <mark class="bold">second blog post</mark> is all about my blog post.
      </div>
    ),
    published: "Published 2 days ago by ",
    link: "",
    image: image
  },
  {
    id: 3,
    author: "Israel",
    content: (
      <div>
        My <mark class="bold">third blog post</mark> is all about my blog post.
      </div>
    ),
    published: "Published 3 days ago by ",
    link: "",
    image: image
  },
];
