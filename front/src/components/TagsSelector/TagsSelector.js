import React from "react";
import "./TagsSelector.css";
import axios from "axios";
import { WithContext as ReactTags } from 'react-tag-input';
import AlertMessage from "../../components/AlertMessage/AlertMessage";


const KeyCodes = {
  comma: 188,
  enter: 13,
};


class TagsSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestions: [],
      hasResults: true,
      delimiters: [KeyCodes.comma, KeyCodes.enter],
      popup: {
        message: null,
        isPopupOpen: false,
      },
    };
  }

  componentDidMount = () => {
    const { tags } = this.props
    axios
      .get("/api/tags")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            suggestions: res.data,
            tags: tags || []
          });
        }
        this.filterSuggestions()
      })
      .catch((error) => console.log(error, "Couldn't get suggestions tags"));
  };

  handleAddTag = (tag) => {
    const { tags } = this.state
    const newTag = {
      id: tag.id.toLowerCase(),
      name: tag.name.toLowerCase()
    }
    
    if (tags.length === 10) {
      return this.setState({
        ...this.state,
        popup: {
          ...this.state.popup,
          message: 'You can choose max 10 tags',
          isPopupOpen: true,
        }
      })
    }

    if (tags.find(val => val.name.toLowerCase() === newTag.name) && tags.length) {
      return this.setState({
        ...this.state,
        popup: {
          ...this.state.popup,
          message: 'Tag is already added to your post',
          isPopupOpen: true,
        }
      })
    }
    this.setState((state) => ({ tags: [...state.tags, newTag] }));
  };

  handleRemoveTag = (i) => {
    const { tags } = this.state
    if (tags.length === 0) return
    this.setState({
      ...this.state,
      suggestions: [...this.state.suggestions, this.state.tags[i]],
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
      const { tags } = this.state
      this.props.getSelectedTags(tags)
      this.filterSuggestions()
    }
  }

  filterSuggestions = () => {
    const { tags, suggestions } = this.state
    const filteredSuggestions = suggestions.filter(value => !tags.some(tag => tag.name === value.name && 
      tag.name === value.name))
    this.setState({
      ...this.state,
      suggestions: filteredSuggestions
    })
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

  disableSpace = e => {
    if (e.charCode === 32) {
      e.preventDefault();
    }
  };

  handleInputChange = (tag) => {
    if (this.props.action === 'search') {
      this.setState({
        ...this.state,
        delimiters: [KeyCodes.comma, KeyCodes.enter]
      })
      const { suggestions } = this.state
      const isTagExist = suggestions.find(suggestion => suggestion.name === tag)
      if (!isTagExist) {
        this.setState({
          ...this.state,
          delimiters: [KeyCodes.comma]
        })
      }
    }
  }


  render() {
    const { popup, tags, suggestions } = this.state
    const { message, isPopupOpen } = popup
    const { classNames } = this.props
    this.closePopupIfOpen()
    return (
      <div id="tags-selector-container" onKeyPress={this.disableSpace}>
        {isPopupOpen && <AlertMessage message={message} type='failed' />}
        <ReactTags
          tags={tags}
          labelField={'name'}
          inputFieldPosition="top"
          maxLength={12}
          allowUnique={false}
          placeholder='#'
          suggestions={suggestions}
          handleDelete={this.handleRemoveTag}
          handleAddition={this.handleAddTag}
          handleDrag={this.handleDrag}
          delimiters={this.state.delimiters}
          handleInputChange={this.handleInputChange}
          autocomplete={true}
        />
      </div>
    );
  }
}

export default TagsSelector;
