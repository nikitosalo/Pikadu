// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM9u0niEP8aA2yom3pwkXyT5q6dN0V4Bs",
  authDomain: "pikadu-nikita.firebaseapp.com",
  databaseURL: "https://pikadu-nikita.firebaseio.com",
  projectId: "pikadu-nikita",
  storageBucket: "pikadu-nikita.appspot.com",
  messagingSenderId: "801575692009",
  appId: "1:801575692009:web:9897e4d2220f6ace223278"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);
// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');


//const regExpValidEmail = ​/^\w+@\w+\.\w{2,}$/;


const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const userAvatarElem = document.querySelector('.user-avatar');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const postsWrapper = document.querySelector('.posts');
const buttonNewPost = document.querySelector('.button-new-post');
const addPostElem = document.querySelector('.add-post');

const setUsers = {
  user: null,
  initUser(handler) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
      if (handler) handler();
    })
  },
  logIn(email, password, handler) {
    /*if(!regExpValidEmail.test(email)) {
      alert('Введите корректное значние e-mail');
      return;
    }*/
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(err => {
        const errCode = err.code;
        const errMessasge = err.message;
        if (errCode === 'auth/wrong-password') {
          console.log(errMessasge);
          alert('Неверный пароль');
        } else if (errCode === 'auth/user-not-found') {
          console.log(errMessasge);
          alert('Пользователь не найден');
        } else {
          alert(errMessasge);
        }
        console.log(err, errCode, errMessasge);
      });
    /* const user = this.getUser(email);
    if (user && user.password === password) {
      this.authUser(user);
      if(handler) {
        handler();
      }
    } else {
      alert ('Пользователь не найден');
    } */
  },
  logOut() {
    firebase.auth().signOut();
    /* if(handler) {
      handler();
    } */
  },
  signUp(email, password, handler) {
    /*if(!regExpValidEmail.test(email)) {
      console.log(email, regExpValidEmail.test(email));
      alert('Введите корректное значние e-mail');
      return;
    }*/
    //const user = {email, password, displayName: email.replace(/@.*/, "")};
    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        this.editUser(email.replace(/@.*/, ""), null, handler);
      })
      .catch(err => {
        const errCode = err.code;
        const errMessasge = err.message;
        if (errCode === 'auth/weak-password') {
          console.log(errMessasge);
          alert('Слабый пароль');
        } else if (errCode === 'auth/email-already-in-use') {
          console.log(errMessasge);
          alert('Этот email уже используется');
        } else {
          alert(errMessasge);
        }
        console.log(err, errCode, errMessasge);
      });
    //if (!this.getUser(email) && email.trim()) {
    //  listUsers.push({email, password, displayName: email.replace(/@.*/, "")});
    //  this.authUser(user);
    //  if(handler) {
    //    handler();
    //  }
    //} else {
    //  alert('Пользователь с таким e-mail уже зарегистрирован');
    //}
  },
/*   getUser(email) {
    return listUsers.find(item => item.email === email)
  },
  authUser(user) {
    this.user = user;
    
  }, */
  editUser(username, userPhotoURL ='', handler) {
    const user = firebase.auth().currentUser;
    if(username) {
      if(userPhotoURL) {
        user.updateProfile({
        displayName: username,
        photoURL: userPhotoURL,
      }).then(handler);
      } else {
        user.updateProfile({
          displayName: username,
        }).then(handler);
      };
      
    };
    if(handler) {
      handler();
    }
  },
  sendForget(email) {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert('Письмо отправлено');
      })
      .catch(err => {
        console.log(err);
      })
  }
}

const loginForget = document.querySelector('.login-forget');
loginForget.addEventListener('click', event => {
  event.preventDefault();
  setUsers.sendForget(emailInput.value);
  emailInput.value = '';
  console.log('send');
})
const setPosts = {
  allPosts : [],
  addPost(title, text, tags, handler) {
    const user = firebase.auth().currentUser;

    this.allPosts.unshift({
      id: `postID: ${(+ new Date()).toString(16)}-${user.uid}`,
      title,
      text,
      tags: tags.split(',').map(item => item.trim()),
      author: {displayName: setUsers.user.displayName, photo: setUsers.user.photoURL},
      date: new Date().toLocaleString(),
      likes: 0,
      comments: 0,
    })

    firebase.database().ref('post').set(this.allPosts)
      .then(() => this.getPosts(handler))
  },
  getPosts(handler) {
    firebase.database().ref('post').on('value', snapshot => {
      this.allPosts = snapshot.val() || [];
      if (handler) handler();
    })
  } 
}

const toggleAuthDom = () => {
  const user = setUsers.user;
  if (user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || userAvatarElem.src;
    buttonNewPost.classList.add('visible');
  } else {
    loginElem.style.display = '';
    userElem.style.display = 'none';
    buttonNewPost.classList.remove('visible');
    addPostElem.classList.remove('visible');
    postsWrapper.classList.add('visible');
  }
}

const showAddPost = () => {
  addPostElem.classList.add('visible');
  postsWrapper.classList.remove('visible');
};

const showAllPosts = () => {
  let postsHTML = '';
  setPosts.allPosts.forEach(({title, text, tags, author, date, likes, comments}) => {
    postsHTML += `
    <section class="post">
        <div class="post-body">
          <h2 class="post-title">${title}</h2>
          <p class="post-text">${text}</p>
          <div class="tags">
            ${tags.map(tag => `<a href="#" class="tag">#${tag}</a>`)}</a>
          </div>
        </div>
        <div class="post-footer">
          <div class="post-buttons">
            <button class="post-button likes">
              <svg width="19" height="20" class="icon icon-like">
                <use xlink:href="img/icons.svg#like"></use>
              </svg>
              <span class="likes-counter">${likes}</span>
            </button>
            <button class="post-button comments">
              <svg width="21" height="21" class="icon icon-comment">
                <use xlink:href="img/icons.svg#comment"></use>
              </svg>
              <span class="comments-counter">${comments}</span>
            </button>
            <button class="post-button save">
              <svg width="19" height="19" class="icon icon-save">
                <use xlink:href="img/icons.svg#save"></use>
              </svg>
            </button>
            <button class="post-button share">
              <svg width="17" height="19" class="icon icon-share">
                <use xlink:href="img/icons.svg#share"></use>
              </svg>
            </button>
          </div>
          <div class="post-author">
            <div class="author-about">
              <a href="#" class="author-username">${author.displayName}</a>
              <span class="post-time">${date}</span>
            </div>
            <a href="#" class="author-link"><img src=${author.photo || "img/avatar.jpeg"} alt="avatar" class="author-avatar"></a>
          </div>
        </div>
      </section>
    `;
  });
  postsWrapper.innerHTML = postsHTML;
  addPostElem.classList.remove('visible');
  postsWrapper.classList.add('visible');
};

const init = () => {
  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', function (event) {
  // отменяем стандартное поведение ссылки
    event.preventDefault();
  // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  });
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);
  });

  loginSignup.addEventListener('click', event => {
    if(passwordInput.value.length < 3) {
      alert('Минимальная длина пароля - 3 символа');
    } else {
      event.preventDefault();
      setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
      loginForm.reset();
    }
  });
  
  exitElem.addEventListener('click', event => {
    event.preventDefault();
    setUsers.logOut();
  });
  
  editElem.addEventListener('click', event => {
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value = userNameElem.textContent;
  });
  
  editContainer.addEventListener('submit', event => {
    event.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
    editContainer.classList.remove('visible');
  });

  buttonNewPost.addEventListener('click', event => {
    event.preventDefault();
    showAddPost();
  });

  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);
};

addPostElem.addEventListener('submit', event => {
  event.preventDefault();
  const { postTitle, postText, postTags } = addPostElem.elements;

  if(postTitle.value.length < 6) {
    alert('Слишком короткий заголовок');
    return;
  };

  if(postText.value.length < 50) {
    alert('Слишком короткий пост');
    return;
  };



  setPosts.addPost(postTitle.value, postText.value, postTags.value, showAllPosts);

  addPostElem.reset();
});

document.addEventListener('DOMContentLoaded', () => {
  init();
});

