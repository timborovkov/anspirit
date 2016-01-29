(function(){
	var qapi = require('../api/qapi.js');
	var speech = require("../api/speech.js");
	var mainRule = require("../rules/main.js");
	var wakeUpListener = null;
	var speechContentDiv = null;

	$(document).ready(function(){
		speechContentDiv = document.getElementById('speech');
		speech.speechDiv(speechContentDiv);
		sayHellolbl();
		wakeUp();

		$(".speechBtn").click(function(){
			if(wakeUpListener.isListening){
				if(speech.listener() == null || !speech.listener().isListening){
					wakeUpListener.stop();
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

	//main processing
	var pr = function(finalValue){
		if (finalValue.contains(international.getGUIText("okey"))) {
			speech.listener().stop();
			speech.say(international.getGUIText("wake me up if you need me"));
			sayHellolbl()
			$(".speechBtn").css("-webkit-filter","invert(0%)");
			wakeUp();
		}else{
			console.log(finalValue);
			mainRule.runRule(finalValue, function(done){
					go();
			});
		}
	}
	function wakeUp(){
		wakeUpListener = new webkitSpeechRecognition();
		wakeUpListener.isListening = false;
		wakeUpListener.lang = qapi.getUserLang();
		wakeUpListener.continuous = true;
		wakeUpListener.interimResults = true;
		wakeUpListener.onresult = function(event){
			if (event.results.length > 0) {
					var result = event.results[event.results.length-1];
						if(result[0].transcript.contains(international.getGUIText("hello"))){
							wakeUpListener.abort();
							wakeUpListener.isListening = false;
							up();
						}
			}
		};
		wakeUpListener.start();
		wakeUpListener.isListening = true;
	}
	window.go = function(){
		if(speech.listener() == null || !speech.listener().isListening){
			speech.recognize(pr);
		}
	}
	function up(){
		//wakeUp
		wakeUpListener.abort();
		speech.say(international.getGUIText("How can I help you"));
		speechContentDiv.innerHTML = international.getGUIText("Speak ...");
		$(".speechBtn").css("-webkit-filter","invert(100%)");
		if(speech.listener() == null || !speech.listener().isListening){
			speech.recognize(pr);
		}
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

	//Stop speech recognition if wakeUp is runninng
	window.setInterval(function(){
		if(speech.listener() != null){
			if(speech.listener.isListening){
					if(wakeUpListener.isListening){
						speech.listener().stop();
						speech.say(international.getGUIText("wake me up if you need me"));
						sayHellolbl()
						$(".speechBtn").css("-webkit-filter","invert(0%)");
					}
			}
		}
	}, 500);


	//DEBUG logging
	window.setInterval(function(){
		if(speech.listener() == null){
			console.log("Main listener: false");
		}else{
			console.log("Main listener: " + speech.listener().isListening);
		}
		if(wakeUpListener == null){
			console.log("Wakeup listener: false");
		}else{
			console.log("Wakeup listener: " + wakeUpListener.isListening);
		}
	}, 5000);

})();
