import React from 'react'
import '../styles/navbar.css'

const Navbar = props => {
  return (
      <div className='navbar'>
        <div className='left-navbar'>
          <a className='vr-line' href=''>Home</a>
          <a className='vr-line' href=''>About Me</a>
          <a href=''>Contact Me</a>
        </div>
        <div className='right-navbar'>
          <a href=''>Login</a>
        </div>
      </div>
  )
}

export default Navbar;
