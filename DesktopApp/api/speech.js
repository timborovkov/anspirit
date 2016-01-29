var qapi = require('./qapi.js');

(function(){
		var speaker = new RobotSpeaker();
		var lastUserTalked = 0;
		var LastQSpeaked = 0;
		var QSpeakingNow = false;
		var recognitionClass = null;
		var listener = null;
		var speechDiv = null;
		var waitingToRecognize = false;

		module.exports.speechDiv = function(dv){
			if(dv){
				speechDiv = dv;
			}
		};

		module.exports.listener = function(){
			return listener;
		};

		module.exports.recognize = function(onResult){
			if(!QSpeakingNow){
				listener = new AudioListener();
			  listener.listen(qapi.getUserLang(), function(text) {
			  		listener.stop();
						speechDiv.innerHTML = text;
						lastUserTalked = new Date().getTime();
			  		onResult(text);
			  }, function(text){
						speechDiv.innerHTML = text;
				});
			}else{
				waitingToRecognize = true;
			}
		};

		module.exports.say = function(text, lang){
			var now = new Date().getTime();
			var callback = function(){
				LastQSpeaked = now;
				QSpeakingNow = false;
				go();
			};
			QSpeakingNow = true;
			if(qapi.getUserLang() != "en"){
				speaker.speak(getUserLang(), text, callback);
			}else{
				speaker.speak("en-GB", text, callback);
			}
		}


		//Webspeech.js
		function RobotSpeaker(){
			var callback = null;
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
					if(callback != null){
						callback();
					}
				};
				this.speak = function(lang, text, cb){
						if(listener != null){
								listener.stop();
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
		    this.stop = function(){
						this.isListening = false;
		        this.listener.abort();
		    };
				this.restartListener = function(){
					this.listener.abort();
					go();
				};

		}
		window.setInterval(function(){
			if(!QSpeakingNow && waitingToRecognize){
				waitingToRecognize = false;
				go();
			}
		}, 50);
		window.setInterval(function(){
			if(listener != null){
				var now = new Date().getTime();
				if(lastUserTalked < (now - 10000) && lastUserTalked != 0){
					if(!QSpeakingNow){
						if(LastQSpeaked < (now - 10000) && LastQSpeaked != 0){
							//if(listene)
							$(".speechBtn").trigger('click');
						}
					}
				}
			}
		}, 500)

})();
