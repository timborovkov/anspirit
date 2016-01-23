
(function(speechDiv){
		var speaker = new RobotSpeaker();
		var lastUserTalked = 0;
		var LastQSpeaked = 0;
		var QSpeakingNow = false;
		var recognitionClass = null;
		var listener = null;
		var speechDiv = null;

		module.exports.speechDiv = function(dv){
			if(dv){
				speechDiv = dv;
			}
		};

		module.exports.listener = function(){
			return listener;
		};

		module.exports.recognize = function(onResult){
			var a = false;
			while(!a){
				listener = new AudioListener();
				if (listener != null){
					a = true;
				}
			}
			console.log("Listening...");
		  listener.listen(getUserLang(), function(text) {
		  		listener.stop();
					speechDiv.innerHTML = text;
					lastUserTalked = new Date().getTime();
		  		onResult(text);
		  }, function(text){
					speechDiv.innerHTML = text;
			})
		};

		module.exports.say = function(text, lang){
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
							if(listener)
							$(".speechBtn").trigger('click');
						}
					}
				}
			}
		}, 1000)



		//Webspeech.js
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
})();
