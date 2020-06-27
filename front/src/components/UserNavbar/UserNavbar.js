import React from 'react'
import { Link } from "react-router-dom";
import './UserNavbar.css'

const UserNavbar = (props) => {
  const { isLoggedIn } = props;
  const getAllTagsJSX = (tags) => {
    const tagsJSX = tags.map(tag => {
      return (
        <option>{tag}</option>
      )
    })
    return tagsJSX
  }
  if (!isLoggedIn) return null
  return (
    <div id='user-navbar-container'>
      <div id='left-menu'>
        <Link to="/posts/new">
          New Post
        </Link>
        <Link to="#">
          My Posts
        </Link>
      </div>
      <div id='right-menu'>
        <div id='search-post-container'>
          <input type='search'/>
          <button>Search Post</button>
        </div>
        <div id='filter-post-container'>
          <header>Filter Using Tags</header>
          <input list='tags' name='blog-tags' placeholder='#'/>
          <datalist id='tags'>
            <option value='Oshri'/>
          </datalist>
        </div>
      </div>
    </div>
  )
}

export default UserNavbar
