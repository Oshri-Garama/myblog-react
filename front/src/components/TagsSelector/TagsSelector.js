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
    if (this.props.updatePost) {
      const { postId } = this.props
      axios.get(`/api/tags/${postId}`, {is_route: true, withCredentials: true }).then(res => {
        if (res.status === 200) {
          console.log(res.data)
          this.setState({
            ...this.state,
            tags: res.data
          })
        }
      }).catch((error) => console.log(error, "Couldn't get post tags"));
    }
    axios
      .get("/api/tags")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            suggestions: res.data,
          });
        }
      })
      .catch((error) => console.log(error, "Couldn't get suggestions tags"));
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

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.tags !== this.state.tags) {
      this.props.getSelectedTags(this.state.tags)
    }
  }

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
