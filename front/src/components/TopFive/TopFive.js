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
    <div className='top-five-post'>
      <div className='post-rank'>1</div>
      <div className='content-container'>
        <img src='https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png'></img>
        <header className='post-title'>Post One Post one Post One Post One</header>
      </div>
    </div>
    <div className='top-five-post'>
      <div className='post-rank'>2</div>
      <div className='content-container'>
        <img src='https://images.ctfassets.net/hrltx12pl8hq/17iLMo2CS9k9k3d2v9uznb/d3e7080e01a1aedca423eb220efc23ee/shutterstock_1096026971_copy.jpg?fit=fill&w=480&h=400'></img>
        <header className='post-title'>Post One Post One Post One Post One</header>
      </div>
    </div>
    <div className='top-five-post'>
      <div className='post-rank'>3</div>
      <div className='content-container'>
        <img src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'></img>
        <header className='post-title'>Post Three Post Three Post Three Post Three</header>
      </div>
    </div>
    <div className='top-five-post'>
      <div className='post-rank'>4</div>
      <div className='content-container'>
        <img src='https://previews.123rf.com/images/alexis84/alexis841404/alexis84140400557/27773925-planet-earth-and-blue-human-eye-elements-of-this-image-furnished-by-nasa-.jpg'></img>
        <header className='post-title'>Post Four Post Four Post Three Post Four</header>
      </div>
    </div>
    <div className='top-five-post'>
      <div className='post-rank'>5</div>
      <div className='content-container'>
        <img src='https://filedn.com/ltOdFv1aqz1YIFhf4gTY8D7/ingus-info/BLOGS/Photography-stocks3/stock-photography-slider.jpg'></img>
        <header className='post-title'>Post Four Post Four Post Three Post Four</header>
      </div>
    </div>
  </div>
}

export default TopFive
