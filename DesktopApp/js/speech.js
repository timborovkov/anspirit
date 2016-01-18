var speaker = new RobotSpeaker();
var listener;
var lastUserTalked = 0;
var LastQSpeaked = 0;
var QSpeakingNow = false;

function recognize(onResult){
	var a = false;
	while(!a){
		listener = new AudioListener();
		if (listener != null){
			a = true;
		}else{
			console.log('Null in audiolistener');
		}
	}
	console.log("Listening...");
  listener.listen(getUserLang(), function(text) {
  		listener.stop();
			lastUserTalked = new Date().getTime();
  		onResult(text);
  }, function(text){
			var speechDiv = document.getElementsByClassName("speech")[0];
			speechDiv.innerHTML = text;
	})
}
function say(text, lang){
	var now = new Date().getTime();
	var callback = function(){
		LastQSpeaked = now;
		QSpeakingNow = false;
	};
	QSpeakingNow = true;
	if(getUserLang() != "en"){
		speaker.speak(getUserLang(), text, callback);
	}else{
		speaker.speak("en-GB", text, callback);
	}
}
window.setInterval(function(){
	if(listener != null){
			listener.restartListener();
	}
}, 20000);
window.setInterval(function(){
	if(listener != null){
		var now = new Date().getTime();
		if(lastUserTalked < (now - 10000) && lastUserTalked != 0){
			if(!QSpeakingNow){
				if(LastQSpeaked < (now - 10000) && LastQSpeaked != 0){
					$(".speechBtn").trigger('click');
				}
			}
		}
	}
}, 1000)
