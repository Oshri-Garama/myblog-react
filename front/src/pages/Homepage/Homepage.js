import React from "react";
import Posts from "../../components/Posts/Posts";
import "./Homepage.css";
import TopFive from "../../components/TopFive/TopFive";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Link } from "react-router-dom";
import newPostSVG from "../../images/newPost.svg";
import allPostsSVG from "../../images/allPosts.svg";
import myPostsSVG from "../../images/myPosts.svg";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { posts, userId, isLoggedIn } = this.props;
    return (
      <div id="home-container">
        <header>Writee {'\n'}
          Memories Don't Last Forever
        </header>
        <div id="buttons-homepage">
          <Link className="button-homepage" to="/posts/new">
            <img src={newPostSVG} />
          </Link>
          <Link className="button-homepage" to="/posts">
            <img src={allPostsSVG} />
          </Link>
          <Link className="button-homepage" to="/">
            <img src={myPostsSVG} />
          </Link>
        </div>
      </div>
    );
  }
}

export default Homepage;
