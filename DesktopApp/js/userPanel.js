$ = require('jquery')
var jQuery = require('jquery')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./storage')
var platform = require('./api/platform.js')

var rec_done = false

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function logout () {
	localStorage.removeItem('name')
	localStorage.removeItem('id')
	localStorage.removeItem('version')
	localStorage.removeItem('pass')
	localStorage.removeItem('email')
	localStorage.removeItem('lang')
	localStorage.removeItem('age')

	$(location).attr('href','file://' + __dirname + '/login.html')
}

$(document).ready(function(){
	//say('Hi' + localStorage.getItem('name'))
	$('#fullpage').fullpage({
		scrollingSpeed: 700,
		keyboardScrolling: true,
		controlArrows: true
	})
})

function newLang(val){
	if (val != "en"){
		sweetAlert('language not yet available!')
		document.getElementById("lang").value = "en"
	}
}

window.onload = function(){
	document.getElementById("lang").value = localStorage.getItem('lang')
	document.getElementById("name_field").value = localStorage.getItem('name')
	startRec()
}

window.setInterval(function(){
  	if (rec_done){
		console.log('Starting new rec')
		rec_done = false
		startRec()
	}
}, 500);
function startRec(){
	recognize(function(text){
		console.log('Final speech: '+ text)
		pr(text)
		rec_done = true
	})
}
function newName(newName){
	$.ajax({
		type: "post",
	    url: getServer() + '/changeUser.php',
	    data: {'valueToChange': 'fullname', 'newValue': newName, 'userID': localStorage.getItem('id'), 'tokenCode': localStorage.getItem('tokenCode')},
	    success: function(data){
	      //process response
	      	if(data.done){
	      		sweetAlert('Done', 'Your name has been updated', 'success')
	      		localStorage.setItem('name', newName)
	      	}else if(data.error){
	      		sweetAlert('Error', 'Something went wrong on server!', 'error')
	      		document.getElementById("name_field").value = localStorage.getItem('name')
	      	}else if(data.denied){
	      		sweetAlert('Error', 'Access denied!', 'error')
	      		document.getElementById("name_field").value = localStorage.getItem('name')
	      	}else{
	      		sweetAlert(data)
	      	}
	    },
	    error: function(a, error){
	    	sweetAlert('Error', 'Something went wrong on server!', 'error')
	    	document.getElementById("name_field").value = localStorage.getItem('name')
	    },
	    dataType: "json"
	});
}

//Some other cool stuff
function open(link){
	var cp = require("child_process");
	cp.exec('open ' + link,
	  function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});
}
function getPlatform(){
	//	https://github.com/bestiejs/platform.js
	return platform
}
function getUserName(){
	return localStorage.getItem('name')
}
function getUserLang(){
	return localStorage.getItem('lang')
}
