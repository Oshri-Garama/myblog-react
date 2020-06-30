import React from 'react'
import './TopFive.css'

const TopFive = (props) => {
  // let title = 'sdfafdasfsd'
  // console.log(title.length)
  // let shortenTitle = title;
  // if (title.length > 35) {
  //   shortenTitle = title.slice(0,30) + '...'
  // }
  // const hasMoreText = () => {
  //   const hasMoreText = fullText.localeCompare(title) > 0
  //   console.log(hasMoreText)
  //   return hasMoreText ? (<span class='extra-text'>f</span>) : null;
  // }
  return <div className='top-five-posts-container'>
    <div id='first-top-post' className='top-five-post'>
      <div className='content-container'>
        <img src='https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png'></img>
        <div id='footer-container-top-post'>
          <div className='post-rank'>1</div>
          <header className='post-title'>Post One Post one Post One Post One</header>
        </div>
      </div>
    </div>
    <div className='top-five-post'>
      <div className='content-container'>
        <img src='https://images.ctfassets.net/hrltx12pl8hq/17iLMo2CS9k9k3d2v9uznb/d3e7080e01a1aedca423eb220efc23ee/shutterstock_1096026971_copy.jpg?fit=fill&w=480&h=400'></img>
        <div id='footer-container-top-post'>
        <div className='post-rank'>2</div>
        <header className='post-title'>Post One Post One Post One Post One</header>
        </div>
      </div>
    </div>
    <div className='top-five-post'>
      <div className='content-container'>
        <img src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'></img>
        <div id='footer-container-top-post'>
          <div className='post-rank'>3</div>
          <header className='post-title'>Post Three Post Three</header>
        </div>
      </div>
    </div>
    <div className='top-five-post'>
      <div className='content-container'>
        <img src='https://previews.123rf.com/images/alexis84/alexis841404/alexis84140400557/27773925-planet-earth-and-blue-human-eye-elements-of-this-image-furnished-by-nasa-.jpg'></img>
        <div id='footer-container-top-post'>
         <div className='post-rank'>4</div>
         <header className='post-title'>Post Four Post Four Post Three Post Four</header>
        </div>
      </div>
    </div>
    <div id='fifth-top-post' className='top-five-post'>
      <div className='content-container'>
        <img src='https://images.unsplash.com/photo-1573725342230-178c824a10f2?ixlib=rb-1.2.1&w=1000&q=80'></img>
        <div id='footer-container-top-post'>
          <div className='post-rank'>5</div>
          <header className='post-title'>Post Four Post Four Post Three Post Four</header>
        </div>
      </div>
    </div>
  </div>
}

export default TopFive
