import axios from 'axios'

const getAllPosts = () => {
  axios
    .get("/api/posts", { withCredentials: true })
    .then((res) => {
      if (res.status === 200) {
        const bla = res.data
        return 'ba'
      }
    })
    .catch((error) => console.log(error, "Couldn't load posts"));
};

export { getAllPosts }
