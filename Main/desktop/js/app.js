  var app = {
    server: "http://localhost:3000/",
    cards: ""
  };

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  function getAge(dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  }

//********
//Firebase
//********

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB1XvTOttQ4a5Z3rW3pliiZkJZCMGCCZ7s",
    authDomain: "project-9160404937466194992.firebaseapp.com",
    databaseURL: "https://project-9160404937466194992.firebaseio.com",
    storageBucket: "project-9160404937466194992.appspot.com",
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  //User account managment
    function onAuthStateChanged(callback){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var name, email, photoUrl, uid;
          name = user.displayName;
          email = user.email;
          photoUrl = user.photoURL;
          uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                           // this value to authenticate with your backend server, if
                           // you have one. Use User.getToken() instead.
          callback(user);
        } else {
          // No user is signed in.
          callback(null);
        }
      });
    }
    function firebaseLogin(email, password, type, callback){
      switch (type) {
        case "normal":
            var failed = false;
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
              // Handle Errors here.
              failed = true;
              var errorCode = error.code;
              var errorMessage = error.message;
              console.error(errorMessage);
              callback(false);
            });
            setTimeout(function () {
              if(!failed){
                firebaseGetUserData();
                callback(true);
              }
            }, 2000);
          break;
        case "google":
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                var user = result.user;
                firebaseGetUserData();
                callback(true);
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;

                console.error(errorMessage);
                callback(false);
            });
          break;
        case "facebook":
            var provider = new firebase.auth.FacebookAuthProvider();
            provider.addScope('user_birthday');
            firebase.auth().signInWithPopup(provider).then(function(result) {
              // This gives you a Facebook Access Token. You can use it to access the Facebook API.
              var token = result.credential.accessToken;
              var user = result.user;
              firebaseGetUserData();
              callback(true);
            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              var email = error.email;
              var credential = error.credential;

              console.error(errorMessage);
              callback(false);
            });
          break;
      }
    }
    function firebaseRegister(email, password, callback){
      console.log(email);
      var failed = false;
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        failed = true;
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorMessage);
      });
      setTimeout(function(){
        if(!failed){
          //Done
          console.log(firebase.auth().currentUser.uid);
          callback(firebase.auth().currentUser.uid);
        }else{
          //Error
          callback(false);
        }
      }, 2000)
    }
    function firebaseLogout(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        return true;
      }, function(error) {
        // An error happened.
        console.error(error);
        return false;
      });

      setCookie('firstname', null);
      setCookie('lastname', null);
      setCookie('email', null);
      setCookie('photo', null);

      $(".content").load("pages/sign_in.html");
    }
    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

  // Database managment
    function firebaseSetUserData(data){
      database.ref("users/" + firebase.auth().currentUser.uid).set(data);
    }
    function firebaseUpdateUserData(field, data){
      database.ref("users/" + firebase.auth().currentUser.uid + '/' + field).set(data);
    }
    function firebaseGetUserData(){
      var userId = firebase.auth().currentUser.uid;
      database.ref('users/' + userId).once('value').then(function(snapshot) {
        var user = snapshot.val();
        setCookie('firstname', user.firstname);
        setCookie('lastname', user.lastname);
        setCookie('email', user.email);
        setCookie('photo', user.photo);
      });
    }
    function firebaseAddUser(user, callback){
      var newUser = {
        "about": user.about,
        "birthday": user.birthday,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "address": user.address,
        "photo": user.photo,
        "facebook": user.facebook,
        "twitter": user.twitter,
        "instagram": user.instagram,
        "linkedin": user.linkedin
      };

      setCookie('firstname', user.firstname);
      setCookie('lastname', user.lastname);
      setCookie('photo', user.photo);
      setCookie('email', user.email);

      var updates = {};
      updates['/users/' + firebase.auth().currentUser.uid] = newUser;

      database.ref().update(updates);
      callback();
    }
