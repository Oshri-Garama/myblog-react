import React from "react";
import "./TagsSelector.css";
import axios from "axios";
import { WithContext as ReactTags } from 'react-tag-input';


const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class TagsSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestions: [],
    };
  }

  componentDidMount = () => {
    axios
      .get("/api/tags")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            suggestions: res.data,
          });
          console.log(res.data)
        }
      })
      .catch((error) => console.log(error, "Couldn't get tags"));
  };

  getAllTagsJSX = () => {
    const { tags } = this.state;
    const tagsJSX = tags.map((tag) => {
      const { tagId, tagName } = tag;
      return <option key={tagId}>#{tagName}</option>;
    });
    return tagsJSX;
  };

  handleSelectTag = (tag) => {
    this.setState((state) => ({ tags: [...state.tags, tag] }));
  };

  handleRemoveTag = (i) => {
    this.setState({
      tags: this.state.tags.filter((tag, index) => index !== i),
    });
  };

  handleDrag = (tag, currPos, newPos) => {
    const { tags } = this.state
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  };

  render() {
    const { tags, suggestions } = this.state
    return (
      <div id="tags-container">
        {/* <input
          type="email"
          list="tags"
          multiple="multiple"
          name="blog-tags"
          placeholder="#"
          onChange={this.handleSelectTag}
          onKeyDown={this.handleRemoveTag}
        />
        <datalist id="tags">{this.getAllTagsJSX()}</datalist> */}
        <ReactTags
          tags={tags}
          labelField={'name'}
          inputFieldPosition="top"
          placeholder='#'
          suggestions={suggestions}
          handleDelete={this.handleRemoveTag}
          handleAddition={this.handleSelectTag}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
        />
      </div>
    );
  }
}

export default TagsSelector;