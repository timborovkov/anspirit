/**
 * Created by Tim Borovkov in 2015.
 */
	/**
	 * a robotic speaker who speaks with given text and language
	 */
	var recognitionClass = null;

	function RobotSpeaker(){
		var callback = function(){};

		try{
			this.u = new SpeechSynthesisUtterance();
		}
		catch(ex){
			throw "This browser does not have support for webspeech api";
		}
	    this.u.rate = 1.0;
			var voices = window.speechSynthesis.getVoices();
			this.u.voice = voices[2];

			this.u.onend = function(event) {
				if(recognitionClass != null){
					recognitionClass.restartListener();
				}
				callback();
	    };
	    this.speak = function(lang, text, cb){
				if(recognitionClass != null){
					recognitionClass.stop();
				}
					callback = cb;
	        this.u.lang = lang;
	        this.u.text = text;
	        speechSynthesis.speak(this.u);
	    };
	}

	//Speech to text API
	function AudioListener(callback, notFinal){
			this.isListening = false;
			this.newLang;
			this.listener = new webkitSpeechRecognition();
			this.listener.interimResults = true;
	  	this.callBack = callback;
	    this.listener.lang = "en";
	    var me = this;
	    this.listener.onresult = function(event) {
	        if (event.results.length > 0) {
	            var result = event.results[event.results.length-1];
	            if(result.isFinal) {
	                me.callBack(result[0].transcript);
	            }else{
									me.ifNotFinal(result[0].transcript + "...");
							}
	        }
	    };
	    this.listen = function(lang, callback, notFinal) {
					this.isListening = true;
	        if(lang) {
	            this.listener.lang = lang;
	        }
	        if(callback) {
	            this.callBack = callback;
	        }
					if(notFinal){
						this.ifNotFinal = notFinal;
					}
	        this.listener.start();
					recognitionClass = this;
	    };
	    this.stop = function() {
					this.isListening = false;
	        this.listener.stop();
	        console.log("audio listener stopped");
	    };
			this.restartListener = function(){
				go();
			};
	}
