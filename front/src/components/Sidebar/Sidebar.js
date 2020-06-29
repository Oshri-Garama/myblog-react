import React from 'react'
import './Sidebar.css'
import SearchOptions from '../SearchOptions/SearchOptions'


const Sidebar = (props) => {
  const { isLoggedIn } = props
  return (
    <div id='sidebar-container'>
      <SearchOptions />
    </div>
  )
}

export default Sidebar;
