(function(){
	var qapi = require('./api/qapi.js');
	var speech = require("./api/speech.js");
	var mainRule = require("./rules/main.js");
	var wakeUpListener;
	var speechContentDiv = null;
	//main processing
	var pr = function(finalValue){
		if (finalValue.contains(international.getGUIText("okay"))) {
			speech.say(international.getGUIText("wake me up if you need me"));
			sayHellolbl()
			$(".speechBtn").css("-webkit-filter","invert(0%)");
			wakeUp();
		}else{
				mainRule.runRule(finalValue, function(done){
						go()
				});
		}
	}
	window.go = function(){
			speech.recognize(pr);
	}
	$(document).ready(function(){
		speechContentDiv = document.getElementById('speech');
		speech.speechDiv(speechContentDiv);
		sayHellolbl();
		wakeUp();
		$(".speechBtn").click(function(){
			if(wakeUpListener.isListening && speech.listener() != null){
				if(!speech.listener().isListening){
					up();
				}
			}else{
				speech.listener().stop();
				speech.say(international.getGUIText("wake me up if you need me"));
				$(".speechBtn").css("-webkit-filter","invert(0%)");
				sayHellolbl();
				wakeUp();
			}
		});
	});

	function wakeUp(){
		wakeUpListener = new webkitSpeechRecognition();
		wakeUpListener.isListening = false;
		wakeUpListener.lang = qapi.getUserLang();
		wakeUpListener.continuous = true;
		wakeUpListener.interimResults = true;
		wakeUpListener.onresult = function(event){
			if (event.results.length > 0) {
					var result = event.results[event.results.length-1];
					if(result.isFinal){
						if(result[0].transcript.contains(international.getGUIText("hello"))){
							wakeUpListener.isListening = false;
							up();
						}
					}
			}
		};
		wakeUpListener.start();
		wakeUpListener.isListening = true;
	}
	function up(){
		//wakeUp
		wakeUpListener.stop();
		speech.say(international.getGUIText("How can I help you"));
		speechContentDiv.innerHTML = international.getGUIText("Speak ...");
		$(".speechBtn").css("-webkit-filter","invert(100%)");
		go();
	}
	function sayHellolbl(){
		switch (qapi.getUserLang()) {
			case "en":
					speechContentDiv.innerHTML = "<font color='red'> Say \" Hello \" </font>";
				break;
			case "ru":
					speechContentDiv.innerHTML = "<font color='red'> Скажи \" Привет \" </font>";
				break;
		}
	}
})();
