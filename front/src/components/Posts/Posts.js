import React, { useState, useEffect } from "react";
import "./Posts.css";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import newPostSVG from "../../images/newPost.svg";
import Post from "./Post";
import TagsSelector from "../TagsSelector/TagsSelector";
import { useTranslation } from "react-i18next";

const DISPLAY_NONE = { display: "none" };
const DISPLAY_BLOCK = { display: "block" };

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [pathname, setPathname] = useState(props.location.pathname);
  const [isEmptyFiltered, setIsEmptyFiltered] = useState(false);
  const [searchByContent, setSearchByContent] = useState(false);
  const [contentToSearch, setContentToSearch] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(props.loggedIn);
  const [userId] = useState(props.userId);
  const { t, i18n } = useTranslation();

  const getAllPosts = (pathname) => {
    axios
      .get(`/api/${pathname}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data);
        }
      })
      .catch((error) => console.log(error, "Couldn't load posts"));
  };

  useEffect(() => {
    const newPathname = props.location.pathname;
    if (newPathname !== pathname) {
      getAllPosts(newPathname);
      setPathname(newPathname);
    }
  }, [props.location.pathname]);

  useEffect(() => {
    if (props.isLoggedIn !== isLoggedIn) {
      setLoggedIn(props.isLoggedIn);
    }
  }, [props.isLoggedIn]);

  const filterPosts = (tags) => {
    if (!tags.length) {
      getAllPosts(pathname);
    } else {
      axios.post("/api/posts/filter", tags).then((res) => {
        if (res.status === 200) {
          if (!res.data.length) {
            setPosts(res.data);
            setIsEmptyFiltered(true);
          } else {
            setPosts(res.data);
            setIsEmptyFiltered(false);
          }
        }
      });
    }
  };

  const getSelectedTags = (tags) => {
    setTags(tags);
    filterPosts(tags);
  };

  const renderPosts = () => {
    const postJSX = posts.map((post) => {
      return (
        <Post
          key={post.id}
          id={post.id}
          author={post.author}
          authorId={post.authorId}
          title={post.title}
          content={post.content}
          published={post.published}
          imageUrl={post.imageUrl}
          userLoggedInId={isLoggedIn ? userId : null}
          getAllPosts={getAllPosts}
          pathname={pathname}
        />
      );
    });
    return postJSX;
  };

  const handleOnSearch = () => {
    axios
      .post("/api/posts/search", { content: contentToSearch })
      .then((res) => {
        if (res.status === 200) {
          if (!res.data.length) {
            setPosts(res.data);
            setIsEmptyFiltered(true);
          } else {
            setPosts(res.data);
            setIsEmptyFiltered(false);
          }
        }
      })
      .catch((error) => console.log(error, "Couldn't search posts"));
  };

  const onChangeContent = (event) => {
    setContentToSearch(event.target.value);
  };

  const setSearchMethod = (event) => {
    setSearchByContent(event.target.checked);
    setContentToSearch("");
    setTags([]);
    setIsEmptyFiltered(false);
    getAllPosts(pathname);
  };

  const renderSearchMethod = () => {
    const header = searchByContent
      ? t("switchToFilterSearch")
      : t("switchToContentSearch");
    return (
      <div className={i18n.language === 'he' ? "search-filter-container hebrew-dir" : "search-filter-container"}>
        {searchByContent ? (
          <div id="tag-selector-search">
            <input
              className="search-input"
              type="text"
              onChange={onChangeContent}
            ></input>
            <button className="search-button" onClick={handleOnSearch}>
              {t("search")}
            </button>
          </div>
        ) : (
          <div id="tag-selector-search">
            <TagsSelector
              action="search"
              getSelectedTags={getSelectedTags}
              tags={tags}
              isEmptyFiltered={isEmptyFiltered}
            />
          </div>
        )}
        <div className="switch-search-container">
          <label className="switch-search-method">
            <input type="checkbox" onChange={setSearchMethod} />
            <span className="slider round"></span>
          </label>
          <header className="tag-search-header">{header}</header>
        </div>
      </div>
    );
  };

  if (pathname === "/user/posts" && !isLoggedIn)
    return <Redirect to="/posts" />;
  const headerTitle =
    pathname === "/posts" ? t("recentPostsHeader") : t("myPosts");

  return (
    <div id="all-posts-page-container">
      <header className={i18n.language === 'he' ? "recent-posts-title recent-posts-title-hebrew" : "recent-posts-title"}>{headerTitle}</header>
      {renderSearchMethod()}
      <div
        style={isLoggedIn ? DISPLAY_BLOCK : DISPLAY_NONE}
        id="add-new-post-container"
      >
        <Link id="add-new-post-button" to="/posts/new">
          <img src={newPostSVG} />
        </Link>
        <header id="recent-posts-button-header">{t("newPost")}</header>
      </div>
      <div id="recent-posts-container">{renderPosts()}</div>
      {isEmptyFiltered && (
        <header id="no-results-header">{t("noResultsFound")}</header>
      )}
    </div>
  );
};

export default Posts;
