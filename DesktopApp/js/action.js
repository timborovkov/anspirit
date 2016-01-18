
var speechContentDiv = null;

//main processing
var pr = function(finalValue){
	if (finalValue == international.getGUIText("okay")) {
		say(international.getGUIText("wake me up if you need me"));
		sayHellolbl()
		$(".speechBtn").css("-webkit-filter","invert(0%)");
		wakeUp();
	}else{
			var main = require("./rules/main.js");
			main.runRule(finalValue, function(done){
					go()
			});
	}
}
function go(){
		recognize(pr);
}
$(document).ready(function(){
	speechContentDiv = document.getElementById('speech');
	sayHellolbl();
	switch (getUserLang()) {
		case "en":
			say("Hello, " + getUserName());
			break;
		case "ru":
			say("Привет, " + getUserName());
			break;
	}
	wakeUp();

	$(".speechBtn").click(function(){
		if(annyang.isListening()){
			up();
		}else{
			listener.stop();
			say(international.getGUIText("wake me up if you need me"));
			$(".speechBtn").css("-webkit-filter","invert(0%)");
			sayHellolbl();
			wakeUp();
		}
	});
});

function wakeUp(){
	if (annyang) {
		annyang.setLanguage(getUserLang());
	  var commands = {
	    'hello': function() {
				up();
	    },
			'hey':function(){
				up();
			},
			'wake up': function(){
				up();
			},
			'привет': function(){
				up();
			},
			'поснись':function(){
				up();
			}
	  };
	  annyang.addCommands(commands);
	  annyang.start();
		console.log("annyang");
	}
}
function up(){
	//wakeUp
	annyang.abort();
	say(international.getGUIText("How can I help you"));
	speechContentDiv.innerHTML = international.getGUIText("Speak ...");
	$(".speechBtn").css("-webkit-filter","invert(100%)");
	go();
}
function sayHellolbl(){
	switch (getUserLang()) {
		case "en":
				speechContentDiv.innerHTML = "<font color='red'> Say hello! </font>";
			break;
		case "ru":
				speechContentDiv.innerHTML = "<font color='red'> Скажи привет! </font>";
			break;
	}
}
