import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'

import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, where, getDocs, orderBy, updateDoc, doc, deleteDoc  } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

/* === Imports === */

/* === Firebase Setup === */

const firebaseConfig = {
  apiKey: 'AIzaSyD1aLX8G3_0dUALyk6kRoVazjzSQ7_KhEs',
  authDomain: 'moody-scrimba-4759f.firebaseapp.com',
  projectId: 'moody-scrimba-4759f',
  storageBucket: 'moody-scrimba-4759f.appspot.com',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// console.log(app.options.projectId)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)
//check is working console.log(db)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

//console.log(auth)

/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById('logged-out-view')
const viewLoggedIn = document.getElementById('logged-in-view')
const userGreetingEl = document.getElementById('user-greeting')

const signInWithGoogleButtonEl = document.getElementById('sign-in-with-google-btn')

const emailInputEl = document.getElementById('email-input')
const passwordInputEl = document.getElementById('password-input')

const signInButtonEl = document.getElementById('sign-in-btn')
const createAccountButtonEl = document.getElementById('create-account-btn')
const signOutButtonEl = document.getElementById('sign-out-btn')

const userProfilePictureEl = document.getElementById('user-profile-picture')

const displayNameInputEl = document.getElementById('display-name-input')
const photoURLInputEl = document.getElementById('photo-url-input')
const updateProfileButtonEl = document.getElementById('update-profile-btn')

const moodEmojiEls = document.getElementsByClassName('mood-emoji-btn')
const textareaEl = document.getElementById('post-input')
const postButtonEl = document.getElementById('post-btn')

const allFilterButtonEl = document.getElementById("all-filter-btn")

const filterButtonEls = document.getElementsByClassName("filter-btn")

const postsEl = document.getElementById('posts')

const updateinfo = document.getElementById('updateinfo')
const updateInputs = document.getElementsByClassName('update_inputs')

updateinfo.onclick = () => {
  updateInputs[0].classList.toggle('updateInputsShow')
  console.log(`click`)
}

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener('click', authSignInWithGoogle)

signInButtonEl.addEventListener('click', authSignInWithEmail)
createAccountButtonEl.addEventListener('click', authCreateAccountWithEmail)
signOutButtonEl.addEventListener('click', authSignOut)

updateProfileButtonEl.addEventListener('click', authUpdateProfile)

for (let moodEmojiEl of moodEmojiEls) {
  moodEmojiEl.addEventListener('click', selectMood)
}
postButtonEl.addEventListener('click', postButtonPressed)


for (let filterButtonEl of filterButtonEls) {
  filterButtonEl.addEventListener("click", selectFilter)
}



/* === State === */

let moodState = 0

/* === Global Consts === */
const collectionName = 'posts'

/* === Main Code === */

// no lugar de chamar manualmente showLoggedOutView()

//  AGORA SIM CONSEGUE SEGURAR O STATE DE LOGADO MESMO SE FIZER REFRESH NA PAGINA
// ENTAO FOI REMOVIDO  O QUE VAI DESMOSTRANDO QUANDO LOGAR OU DESLIGAR EM
// authSignInWithEmail() authCreateAccountWithEmail() authSignOut()

onAuthStateChanged(auth, (user) => {
  // console.log(!user ? 'deslogado' : 'logado', auth)

  if (user) {
    //console.log(user.email)
    // console.log(user.displayName)

    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
   
    // when user log in call this functions
     // console.warn("Your uid is",  user.uid)

    showLoggedInView()
    showProfilePicture(userProfilePictureEl, user)
    showUserGreeting(userGreetingEl, user)
    
    // DEFAULT SELECTED ALL POST STYLES
    updateFilterButtonStyle(allFilterButtonEl)

    // SO CALL THIS posts
    fetchAllPosts(user)
  //  fetchInRealtimeAndRenderPostsFromDB(user)
    // ...
  } else {
    showLoggedOutView()
    
    // demostracao fazer fetch mesmo que !authenticated 
    //fetchInRealtimeAndRenderPostsFromDB()
  }
})

//showLoggedInView()

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
  console.log('Sign in with Google')

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      // The signed-in user info.
      const user = result.user
      // IdP data available using getAdditionalUserInfo(result)
      console.log('Signed in with Google')
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      console.error(error.message)
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
    })
}

function authSignInWithEmail() {
  const email = emailInputEl.value
  const password = passwordInputEl.value

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //console.log(userCredential)
      // Signed in
      clearAuthFields()
      console.log(`Welcome`)
    })
    .catch((error) => {
      console.error(error.message)
      alert('verificar login/senha')
    })
}

function authCreateAccountWithEmail() {
  const email = emailInputEl.value
  const password = passwordInputEl.value

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(`loggin`)
      clearAuthFields()
    })
    .catch((error) => {
      console.error(error)
      // ..
    })

  return auth
}

function authSignOut() {
  /*  Challenge:
		Import the signOut function from 'firebase/auth'

        Use the code from the documentaion to make this function work.
       
        If the log out is successful then you should show the logged out view using showLoggedOutView()
        If something went wrong, then you should log the error message using console.error.
    */
  signOut(auth)
    .then(() => {
      console.warn(` Sign-out successful.`)
    })
    .catch((error) => {
      console.error(error)
    })
}

function authUpdateProfile() {
  /*  Challenge:     
        Resources:
        Justin Bieber profile picture URL: https://i.imgur.com/6GYlSed.jpg
    */

  const newDisplayName = displayNameInputEl.value
  const newPhotoURL = photoURLInputEl.value

  updateProfile(auth.currentUser, {
    displayName: newDisplayName === '' ? auth.currentUser.displayName : newDisplayName,
    photoURL: newPhotoURL === '' ? auth.currentUser.photoURL : newPhotoURL,
  })
    .then(() => {
      // Profile updated!
      console.log(auth.currentUser.displayName)

      console.log(`"Profile updated".`)
      location.reload()
      // ...
    })
    .catch((error) => {
      // An error occurred
      console.error(error.message)
      // ...
    })
}

async function addPostToDB(postBody, user) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      // uid: user,
      body: postBody,
      uid: user.uid,
      createAt: serverTimestamp(),
      mood: moodState,
    })
    console.log('Document written with ID: ', docRef.id)
    console.log(`Created a Post using user: ${user.displayName}`)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}


async function updatePostInDB(docId, newBody) {

      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        body: newBody
      });
}


async function deletePostFromDB(docId) {
  /* Challenge:
      Import deleteDoc and doc from 'firebase/firestore'
      
      Use the code from the documentation to make this function work.
      
      The function should delete the correct post in the database using the docId
   */
      const docRef = doc(db, collectionName, docId);

      await deleteDoc(docRef)
}


function fetchInRealtimeAndRenderPostsFromDB(query, user) {

  /*
  before filter 
  const postsRef = collection(db, collectionName)
  const q = query(postsRef, where("uid", "==", user.uid), orderBy("createAt", "desc"))  
*/
  onSnapshot(query, (querySnapshot) => {
    clearAll(postsEl)

    querySnapshot.forEach((doc) => {
      renderPost(postsEl, doc) // remove doc.data() to doc
  
     // console.log(doc.data())
      })

/*
    querySnapshot.forEach((doc) => {
    renderPost(postsEl, doc.data())

   // console.log(doc.data())
    })
*/
  })
}

function fetchTodayPosts(user){
    const startOfDay = new Date()
    startOfDay.setHours(0,0,0,0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const postsRef = collection(db, collectionName)
    const q = query(postsRef, where("uid", "==", user.uid),
                              where("createAt", ">=", startOfDay),
                              where("createAt", "<=", endOfDay),
                              orderBy("createAt", "desc"))


    fetchInRealtimeAndRenderPostsFromDB(q, user)
}


function fetchWeekPosts(user) {
  const startOfWeek = new Date()

  startOfWeek.setHours(0, 0, 0, 0)
  
  if (startOfWeek.getDay() === 0) { // If today is Sunday
      startOfWeek.setDate(startOfWeek.getDate() - 6) // Go to previous Monday
  } else {
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
  }
  
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)
  
  const postsRef = collection(db, collectionName)
  
  const q = query(postsRef, where("uid", "==", user.uid),
                            where("createAt", ">=", startOfWeek),
                            where("createAt", "<=", endOfDay),
                            orderBy("createAt", "desc"))
                            
  fetchInRealtimeAndRenderPostsFromDB(q, user)

  /*
  onSnapshot(q, (querySnapshot) => {    

    querySnapshot.forEach((doc) => {
     console.log(doc.data())
  

      })
  })
  */
}


function fetchMonthPosts(user) {
  const startOfMonth = new Date()
  startOfMonth.setHours(0, 0, 0, 0)
  startOfMonth.setDate(1)

  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

const postsRef = collection(db, collectionName)
  
  const q = query(postsRef, where("uid", "==", user.uid),
                            where("createAt", ">=", startOfMonth),
                            where("createAt", "<=", endOfDay),
                            orderBy("createAt", "desc"))

      fetchInRealtimeAndRenderPostsFromDB(q, user)
}



function fetchAllPosts(user) {
  /* Challenge:
      This function should fetch ALL posts from the database and render them using the fetchRealtimeAndRenderPostsFromDB function.
  */

  const postsRef = collection(db, collectionName)
   const q = query(postsRef, where("uid", "==", user.uid), orderBy("createAt", "desc"))  

   fetchInRealtimeAndRenderPostsFromDB(q, user)
}



/* == Functions - UI Functions == */

function createPostHeader(postData){
  const headerDiv = document.createElement("div")
  headerDiv.className = "header"

  const headerDate = document.createElement("h3")
  headerDate.textContent = displayDate(postData.createAt)
  headerDiv.appendChild(headerDate)

  const moodImage = document.createElement("img")
  moodImage.src = `assets/emojis/${postData.mood}.png`
  headerDiv.appendChild(moodImage)
  
return headerDiv

}


function createPostBody(postData){
  const postBody = document.createElement("p")
  postBody.innerHTML = replaceNewlinesWithBrTags(postData.body)  
  return postBody
}

function createPostUpdateButton(wholeDoc){
  const postId = wholeDoc.id
  const postData = wholeDoc.data()

  
  const button = document.createElement('button')
  button.textContent = "Edit"
  button.classList.add('edit-color')
  button.addEventListener("click", function(){    
    const newBody = prompt("Edit the post", postData.body)

    if(newBody) {
      updatePostInDB(postId, newBody)
    }
  })

  return button
}


function createPostDeleteButton(wholeDoc) {
  const postId = wholeDoc.id
  
  /* 
      <button class="delete-color">Delete</button>
  */
  const button = document.createElement('button')
  button.textContent = 'Delete'
  button.classList.add("delete-color")
  button.addEventListener('click', function() {
      deletePostFromDB(postId)
      
  })
  return button
}


function createPostFooter(wholeDoc) {
  /* 
      <div class="footer">
          <button>Edit</button>
      </div>
  */
  const footerDiv = document.createElement("div")
  footerDiv.className = "footer"
  
  footerDiv.appendChild(createPostUpdateButton(wholeDoc)) // um vai passando para o outro 
  footerDiv.appendChild(createPostDeleteButton(wholeDoc))
  
  return footerDiv
}



function renderPost(postsEl, wholeDoc) { 
  /*part of implemtation edit, to not broken rest of code */
  const postData = wholeDoc.data()
/*
  postsEl.innerHTML += `
  <div class="post">
  <div class="header">
    <h3>${displayDate(postData.createAt)}</h3>
    <img src="assets/emojis/${postData.mood}.png" />
  </div>
  <p>${replaceNewlinesWithBrTags(postData.body)}</p>
</div>
</div>
  `
*/
  // REFACTORY changing-renderpost-function-to-use-createelement QUE EU JA TINHA FEITO, But now coming from functions, really better
   
  const postDiv = document.createElement('div')
  postDiv.classList.add('post')


  postDiv.appendChild(createPostHeader(postData))
  postDiv.appendChild(createPostBody(postData))
  postDiv.appendChild(createPostFooter(wholeDoc)) // envia para o footer


  postsEl.appendChild(postDiv)
}

function replaceNewlinesWithBrTags(inputString) {
  // Challenge: Use the replace method on inputString to replace newlines with break tags and return the result
  return inputString.replace(/\n/g, '<br>')
}

function postButtonPressed() {
  const postBody = textareaEl.value
  const user = auth.currentUser

  if (postBody && moodState) {
    addPostToDB(postBody, user)
    clearInputField(textareaEl)
    resetAllMoodElements(moodEmojiEls)
  } else {
    console.error('checkout inputFields')
  }
}

function clearAll(element) {
  element.innerHTML = ''
}

function showLoggedOutView() {
  hideView(viewLoggedIn)
  showView(viewLoggedOut)
}

function showLoggedInView() {
  hideView(viewLoggedOut)
  showView(viewLoggedIn)
}

function showView(view) {
  view.style.display = 'flex'
}

function hideView(view) {
  view.style.display = 'none'
}

/* CLEAN INPUTS VALUES */
function clearInputField(field) {
  field.value = ''
}

function clearAuthFields() {
  clearInputField(emailInputEl)
  clearInputField(passwordInputEl)
}

function showProfilePicture(imgElement, user) {
  if (user.photoURL) {
    imgElement.src = user.photoURL
    return
  }
  imgElement.src = './assets/images/default-profile-picture.jpeg'
}

function showUserGreeting(element, user) {
  const userDisplay = user.displayName

  if (userDisplay) {
    // get only first name
    const userFirstName = userDisplay.split(' ')[0]
    element.textContent = `Hey ${userFirstName}, how are you?`
    return
  }
  element.textContent = 'Hey friend, how are you?'
}

function displayDate(firebaseDate) {

  if(!firebaseDate){
    return 'Getting data...'
  }

  const date = firebaseDate.toDate()

  const day = date.getDate()
  const year = date.getFullYear()

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]

  let hours = date.getHours()
  let minutes = date.getMinutes()
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes

  return `${day} ${month} ${year} - ${hours}:${minutes}`
}

/* = Functions - UI Functions - Mood = */

function selectMood(event) {
  const selectedMoodEmojiElementId = event.currentTarget.id

  changeMoodsStyleAfterSelection(selectedMoodEmojiElementId, moodEmojiEls)

  const chosenMoodValue = returnMoodValueFromElementId(selectedMoodEmojiElementId)

  moodState = chosenMoodValue
}

function changeMoodsStyleAfterSelection(selectedMoodElementId, allMoodElements) {
  for (let moodEmojiEl of moodEmojiEls) {
    if (selectedMoodElementId === moodEmojiEl.id) {
      moodEmojiEl.classList.remove('unselected-emoji')
      moodEmojiEl.classList.add('selected-emoji')
    } else {
      moodEmojiEl.classList.remove('selected-emoji')
      moodEmojiEl.classList.add('unselected-emoji')
    }
  }
}

function resetAllMoodElements(allMoodElements) {
  for (let moodEmojiEl of allMoodElements) {
    moodEmojiEl.classList.remove('selected-emoji')
    moodEmojiEl.classList.remove('unselected-emoji')
  }

  moodState = 0
}

function returnMoodValueFromElementId(elementId) {
  return Number(elementId.slice(5))
}


/* == Functions - UI Functions - Date Filters == */

function resetAllFilterButtons(allFilterButtons) {
  for (let filterButtonEl of allFilterButtons) {
      filterButtonEl.classList.remove("selected-filter")
  }
}

function updateFilterButtonStyle(element) {
  element.classList.add("selected-filter")
}


function fetchPostFromPeriod(period, user){
  
  if(period === "today") return fetchTodayPosts(user)
  if(period === "week") return fetchWeekPosts(user)
  if(period === "month") return fetchMonthPosts(user)
    fetchAllPosts(user)
}

function selectFilter(event) {
  const user = auth.currentUser
  
  const selectedFilterElementId = event.target.id
  
  const selectedFilterPeriod = selectedFilterElementId.split("-")[0]
  
  
  const selectedFilterElement = document.getElementById(selectedFilterElementId)
  
  resetAllFilterButtons(filterButtonEls)
  
  updateFilterButtonStyle(selectedFilterElement)


  fetchPostFromPeriod(selectedFilterPeriod, user)

}