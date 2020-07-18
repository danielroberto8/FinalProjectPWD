import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyCeViSLEsoUQ-ifWDaPgukXM3qIURdDt2I",
  authDomain: "bikelah-4edab.firebaseapp.com",
  databaseURL: "https://bikelah-4edab.firebaseio.com",
  projectId: "bikelah-4edab",
  storageBucket: "bikelah-4edab.appspot.com",
  messagingSenderId: "188016331313",
  appId: "1:188016331313:web:ac3db1f225ebd6045ae310",
  measurementId: "G-YML6JTZG41",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
