export var firebaseConfig = {
  apiKey: "AIzaSyBQ22sZzrgvlyPfnMcGa4hXsAym3LlYf6A",
  authDomain: "my-brand-96113.firebaseapp.com",
  databaseURL: "https://my-brand-96113.firebaseio.com",
  projectId: "my-brand-96113",
  storageBucket: "my-brand-96113.appspot.com",
  messagingSenderId: "337382078243",
  appId: "1:337382078243:web:d809db393f0d3c697c3e96",
  measurementId: "G-TMBHXYB6C3",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.firestore();
