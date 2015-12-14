var platform = require("./api/platform.js")
var speaker = new RobotSpeaker()

function recognize(onResult){
	var a = false
	var listener
	while(!a){
		listener = new AudioListener()
		if (listener != null){
			a = true
		}else{
			console.log('Null in audiolistener')
		}
	}

  	listener.listen("en", function(text) {
  		listener.stop()
  		onResult(text)
  	})
}
function say(text){
  speaker.speak("en", text)
}
