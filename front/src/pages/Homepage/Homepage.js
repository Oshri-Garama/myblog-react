import React from "react";
import Posts from "../../components/Posts/Posts";
import "./Homepage.css";
import TopFive from "../../components/TopFive/TopFive";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Link } from "react-router-dom";
import newPostSVG from "../../images/newPost.svg";
import allPostsSVG from "../../images/allPosts.svg";
import myPostsSVG from "../../images/myPosts.svg";
import disableScroll from 'disable-scroll';



class Homepage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    disableScroll.on();
  }

  render() {
    const { posts, userId, isLoggedIn } = this.props;
    return (
      <div id="home-container">
        <div id='title-container'>
          <header id='web-title'>Writee</header>
          <header id='web-subtitle'>Memories Don't Last Forever</header>
        </div>
        <div id="buttons-homepage">
          <div className='button-container'>
            <Link className="button-homepage" to="/posts/new">
              <img src={newPostSVG} />
            </Link>
            <text>New Post</text>
          </div>
          <div className='button-container'>
            <Link className="button-homepage" to="/posts">
              <img src={allPostsSVG} />
            </Link>
            <text>All Posts</text>
          </div>
          <div className='button-container'>
          <Link className="button-homepage" to="/">
            <img src={myPostsSVG} />
          </Link>
          <text>My Posts</text>
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
