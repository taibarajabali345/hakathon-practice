//  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
//  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
//  import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
//  const firebaseConfig = {
//     apiKey: "AIzaSyAgeswIv_0QTnJ_q4dKW0-lNcd5FKJbxh8",
//     authDomain: "four-project-6e6b2.firebaseapp.com",
//     projectId: "four-project-6e6b2",
//     storageBucket: "four-project-6e6b2.firebasestorage.app",
//     messagingSenderId: "372714230664",
//     appId: "1:372714230664:web:f9cecb509468363ffc603d"
//   };

//  const app = initializeApp(firebaseConfig);

//  function showMessage(message, divId){
//     var messageDiv=document.getElementById(divId);
//     messageDiv.style.display="block";
//     messageDiv.innerHTML=message;
//     messageDiv.style.opacity=1;
//     setTimeout(function(){
//         messageDiv.style.opacity=0;
//     },5000);
//  }
//  const signUp=document.getElementById('submitSignUp');
//  signUp.addEventListener('click', (event)=>{
//     event.preventDefault();
//     const email=document.getElementById('rEmail').value;
//     const password=document.getElementById('rPassword').value;
//     const firstName=document.getElementById('fName').value;
//     const lastName=document.getElementById('lName').value;

//     const auth=getAuth();
//     const db=getFirestore();

//     createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential)=>{
//         const user=userCredential.user;
//         const userData={
//             email: email,
//             firstName: firstName,
//             lastName:lastName
//         };
//         showMessage('Account Created Successfully', 'signUpMessage');
//         const docRef=doc(db, "users", user.uid);
//         setDoc(docRef,userData)
//         .then(()=>{
//             window.location.href='signin.html';
//         })
//         .catch((error)=>{
//             console.error("error writing document", error);

//         });
//     })
//     .catch((error)=>{
//         const errorCode=error.code;
//         if(errorCode=='auth/email-already-in-use'){
//             showMessage('Email Address Already Exists !!!', 'signUpMessage');
//         }
//         else{
//             showMessage('unable to create User', 'signUpMessage');
//         }
//     })
//  });

//  const signIn=document.getElementById('submitSignIn');
//  signIn.addEventListener('click', (event)=>{
//     event.preventDefault();
//     const email=document.getElementById('email').value;
//     const password=document.getElementById('password').value;
//     const auth=getAuth();

//     signInWithEmailAndPassword(auth, email,password)
//     .then((userCredential)=>{
//         showMessage('login is successful', 'signInMessage');
//         const user=userCredential.user;
//         localStorage.setItem('loggedInUserId', user.uid);
//         window.location.href='homepage.html';
//     })
//     .catch((error)=>{
//         const errorCode=error.code;
//         if(errorCode==='auth/invalid-credential'){
//             showMessage('Incorrect Email or Password', 'signInMessage');
//         }
//         else{
//             showMessage('Account does not Exist', 'signInMessage');
//         }
//     })
//  })



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgeswIv_0QTnJ_q4dKW0-lNcd5FKJbxh8",
  authDomain: "four-project-6e6b2.firebaseapp.com",
  projectId: "four-project-6e6b2",
  storageBucket: "four-project-6e6b2.appspot.com",
  messagingSenderId: "372714230664",
  appId: "1:372714230664:web:f9cecb509468363ffc603d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth and Firestore
const auth = getAuth();
const db = getFirestore();

// Handle Role Selection
let selectedRole = '';
document.getElementById('signUpPatient').addEventListener('click', () => {
  selectedRole = 'patient';
  enableSignUpButton();
});

document.getElementById('signUpDoctor').addEventListener('click', () => {
  selectedRole = 'doctor';
  enableSignUpButton();
});

// Enable Sign Up Button when role is selected
function enableSignUpButton() {
  const submitButton = document.getElementById('submitSignUp');
  submitButton.disabled = false;
}

// Show Message Function
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 5000);
}

// Sign Up Functionality
const signUpButton = document.getElementById('submitSignUp');
signUpButton.addEventListener('click', async (event) => {
  event.preventDefault();

  // Collect user data from the form
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;

  if (!firstName || !lastName || !email || !password || !selectedRole) {
    showMessage("Please fill in all fields and select a role.", 'signUpMessage');
    return;
  }

  // Create user in Firebase Authentication
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details in Firestore with role (Patient/Doctor)
    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: selectedRole
    });

    // Success: Redirect to Sign In page or show a success message
    showMessage("Sign up successful! Please sign in.", 'signUpMessage');
    document.getElementById('signup').style.display = 'none';
    document.getElementById('signIn').style.display = 'block';
  } catch (error) {
    showMessage(error.message, 'signUpMessage');
  }
});

// Sign In Functionality (your added logic)
const signInButton = document.getElementById('submitSignIn');
signInButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showMessage("Please fill in both fields.", 'signInMessage');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Redirect to main page or show user data
    showMessage("Sign in successful!", 'signInMessage');
    localStorage.setItem('loggedInUserId', user.uid); // Store user ID in localStorage
    window.location.href = 'homepage.html'; // Redirect to homepage after login
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === 'auth/invalid-credential') {
      showMessage('Incorrect Email or Password', 'signInMessage');
    } else {
      showMessage('Account does not exist', 'signInMessage');
    }
  }
});

// Toggle between Sign Up and Sign In pages
document.getElementById('signInButton').addEventListener('click', () => {
  document.getElementById('signup').style.display = 'none';
  document.getElementById('signIn').style.display = 'block';
});

document.getElementById('signUpButton').addEventListener('click', () => {
  document.getElementById('signIn').style.display = 'none';
  document.getElementById('signup').style.display = 'block';
});
