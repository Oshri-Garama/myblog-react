import React from 'react'
import './SearchOptions.css'

const SearchOptions = (props) => {
  const getAllTagsJSX = (tags) => {
    const tagsJSX = tags.map(tag => {
      return (
        <option>{tag}</option>
      )
    })
    return tagsJSX
  }

  return (
    <div id='search-filter-seperator'>
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
  )
}

export default SearchOptions
