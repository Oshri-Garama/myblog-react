# Full Stack Development Course


As part of full stack development course, our final project was to create a blog website.

Task #1

At first I wrote some HTML + CSS code to implement the home page's structure of my blog, and then show it using gh-pages as in here:

https://oshri-garama.github.io/blog/

Task #2 

Converted it into React Application, and deployed it using gh-pages.

Task #3

Used react-router-dom and implemented multiple pages.

The results so far with static 3 posts: 

https://oshri-garama.github.io/myblog-react/

Task #4

Created database in mysql and implemented backend routes for: "get all posts", "add new post" using Flask, requests and Jsonify in python,
then had to connect the routes to the frontend - with "axios".
This time I didn't upload it to gh-pages.

Task #5

Added functionality for user managmanet: sign up, log in, log out.
using bcrypt to hash the password given by the user and cookies to specify session.

Task #6

Implemented sign up and sign in pages and connected the backend to the frontend

Task #7

Implemented single post page which allow to navigate to blog post and see the full content of it, and later on also to comment on post.

Task 8 

1. Editing and deleting an existing blog post, only by the author of the post. This page is only available after login, and only to the author of the post. Includes backend validation for the author to match the blog post

2. Adding built-in comments to a blog post. Includes frontend, backend and database support. Any author can add comments to any other post by other authors. This information is saved in the database and shown on repeated visits to the blog post.

Task 9
Learned of AWS: EC2, RDS, load balencers, S3 buckets. Made instances, and moved the BE, FE servers online. 

last mandatory tasks

1. Adding tags to a blog post. Tags allow for categorization of blog posts on similar topics. Added via a “new post” or “update post” page.
2. Searching for all posts with a specific tag. Clicking on a specific tag will present a list of blog posts with that tag
3. Searching for blog posts by content (free text). Will allow entering text and will then search in the database for all blog posts that include the given words.
4. A more complex HTML text editor with styling for blog posts. Allows styling like bold/italic/underscore, adding links, changing text size
5. Blog looks and functions well on a mobile device. 

Extra:
1. Didn't learn hooks in the course, and decided to learn by myself, then I changed all of the functions to work with hooks.
2. Possibility to change the langauge in the blog using I18n.next: support for Hebrew, English.
3. Possiblity to insert image to blog.
4. Multi tag search







