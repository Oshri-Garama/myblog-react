import React from "react";
import "./TagsSelector.css";
import axios from "axios";
import { WithContext as ReactTags } from 'react-tag-input';
import AlertMessage from "../../components/AlertMessage/AlertMessage";


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
      popup: {
        message: null,
        isPopupOpen: false,
      },
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

  handleAddTag = (tag) => {
    const { tags } = this.state
    if (tags.length === 5) {
      this.setState({
        ...this.state,
        popup: {
          ...this.state.popup,
          message: 'You can choose up to 5 tags',
          isPopupOpen: true,
        }
      })
      return
    }
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

  closePopupIfOpen = () => {
    const { isPopupOpen } = this.state.popup;
    if (isPopupOpen) {
      setTimeout(() => {
        this.setState({
          ...this.state,
          popup: {
            isPopupOpen: false,
            message: null,
          },
        });
      }, 4000);
    }
  };

  render() {
    const { popup, tags, suggestions } = this.state
    const { message, isPopupOpen } = popup
    this.closePopupIfOpen()
    return (
      <div id="tags-container">
        {isPopupOpen && <AlertMessage message={message} type='failed' />}
        <ReactTags
          tags={tags}
          labelField={'name'}
          inputFieldPosition="top"
          maxLength='12'
          placeholder='#'
          suggestions={suggestions}
          handleDelete={this.handleRemoveTag}
          handleAddition={this.handleAddTag}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
        />
      </div>
    );
  }
}

export default TagsSelector;
