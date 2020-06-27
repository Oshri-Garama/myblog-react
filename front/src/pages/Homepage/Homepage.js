import React from "react";
import Posts from "../../components/Posts/Posts";
import UserNavbar from '../../components/UserNavbar/UserNavbar'
import './Homepage.css'
import TopFive from '../../components/TopFive/TopFive'

class Homepage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { posts, userId, isLoggedIn } = this.props;
    return (
      <div id="home-container">
        <div id='seperator-center'>
          <div id='seperator-top'>
            <div id="blog-logo-container">
              <img src='https://www.gleannlochlandscaping.com/wp-content/themes/land2/images/sliders/01.jpg'/>
            </div>
            <div id='top-five'>
              <header id='top-five-title'>TOP FIVE</header>
              <TopFive/>
            </div>
          </div>
            <UserNavbar isLoggedIn={isLoggedIn}/>
        </div>
        <div id='footer-page-container'>
          <div id='recent-posts-container'>
            <header id="blog-title">Latests Posts</header>
            <div id='posts-container'>
              <Posts posts={posts} isLoggedIn={isLoggedIn} userId={userId} />
            </div>
          </div>
            <div>Sidebar</div>
          </div>
        {/* <div className="blog-container">
          <header>
          </header>
        </div> */}
        {/* <Sidebar posts={posts} /> */}
      </div>
    );
  }
}

export default Homepage;
