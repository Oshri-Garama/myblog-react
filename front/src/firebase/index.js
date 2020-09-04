import firebase from 'firebase/app'
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyC3gYQOThfonXR841PtF1f4VnqOUpcGpr0",
  authDomain: "writee-blog.firebaseapp.com",
  databaseURL: "https://writee-blog.firebaseio.com",
  projectId: "writee-blog",
  storageBucket: "writee-blog.appspot.com",
  messagingSenderId: "105831620098",
  appId: "1:105831620098:web:53218d306153e0a732911b"
};

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()

export { storage, firebase as default}
