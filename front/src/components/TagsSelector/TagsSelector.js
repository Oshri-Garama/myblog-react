import React from "react";
import "./TagsSelector.css";
import axios from "axios";

class TagsSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      tags: []
    }
  }

  componentDidMount = () => {
    axios
      .get("/api/tags")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            tags: res.data
          })
        }
      })
      .catch((error) => console.log(error, "Couldn't get tags"));
  };

    getAllTagsJSX = () => {
      const { tags } = this.state
    const tagsJSX = tags.map((tag) => {
      const { tagId, tagName } = tag;
      return <option key={tagId}>#{tagName}</option>;
    });
    return tagsJSX;
  };

  render() {
    return (
      <div id="tags-container">
        <input list="tags" name="blog-tags" placeholder="#" />
        <datalist id="tags">
          {this.getAllTagsJSX()}
        </datalist>
      </div>
    );
  }
}

export default TagsSelector;
