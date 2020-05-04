import React from "react";
import Navbar from "./Navbar";
import Posts from "./Posts";
import Sidebar from "./Sidebar";
import "../styles/app.css";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="page-container">
        <Navbar />
        <div className="home-container">
          <div className="blog-container">
            <header>
              <h1 id="blog-title">This is my blog</h1>
            </header>
            <Posts/>
          </div>
          <Sidebar/>
        </div>
      </div>
    );
  }
}

export default App;
