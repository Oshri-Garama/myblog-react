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
      </div>
    );
  }
}

export default App;
