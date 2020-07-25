

  import firebase from "firebase";
  
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBrZF0PEbStz-98eU85-odNiugk7pyjPTE",
    authDomain: "instameeegram.firebaseapp.com",
    databaseURL: "https://instameeegram.firebaseio.com",
    projectId: "instameeegram",
    storageBucket: "instameeegram.appspot.com",
    messagingSenderId: "261154294938",
    appId: "1:261154294938:web:6d0d3d2352e37ce431e323",
    measurementId: "G-3GK0T4FY64"

  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();


  export {db, auth, storage};