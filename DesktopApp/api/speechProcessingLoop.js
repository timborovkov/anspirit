(function(){

  /*
  *     prepare
  */
  //API
  var qapi = require('../api/qapi.js');
  var international = require('../api/international.js');

  //Variables
  var wakeUpListener = new webkitSpeechRecognition();
  var mainListener = new webkitSpeechRecognition();
  var speakerMessage = new SpeechSynthesisUtterance();
  var voices = null;
  var speechDiv = null;

  /*
  *
  *     Loop functions
  *
  */
  function restartMainVoiceLoop(){
    wakeUpListener = new webkitSpeechRecognition();
    mainListener = new webkitSpeechRecognition();
    startMainVoiceLoop();
  }
  function startMainVoiceLoop(){
    speechDiv.innerHTML = international.getGUIText('Say hello');
    waitForWakeup(international.getGUIText('hello'), function(){
        $('.userTextInput').hide('drop', 100);
        speechDiv.innerHTML = international.getGUIText('Speak ...');
        up();
    });
  }
  function up(){
    speechToText(function(notFinalSpeech){
        speechDiv.innerHTML = notFinalSpeech;
      },function(speech){
        afterGetSpeech(speech);
      });
  }
  function afterGetSpeech(speech){
    speechDiv.innerHTML = speech;
    $('.speechBtn').hide('drop', 80);
    $('.userTextInput').hide('drop', 80);
    doSpeechProcessing(speech, function(){
      $('.speechBtn').show('drop', 80);
      $('.userTextInput').show('drop', 80);
      $('.userTextInput').val("");
      speechDiv.innerHTML = international.getGUIText('Say hello');
      eval("up()");
    });
  }
  function doSpeechProcessing(speech, callBack){
      // Go through extensions to get action for speech request
      $.getJSON("./rules.json", function(data) {
  			var speechRuleFound = false;
  			for(var i = 0; i < data.length; i++){
      				var ruleData = data[i];
      				var link = "../rules/" + ruleData["name"] + "/desktop.js";
      				var Rule = require(link);
      				Rule.processSpeech(speech, function(ruleRes){
                if(ruleRes['done'] == true){
        					speechRuleFound = true;
        					return;
        				};
              });
    			}
      		if(!ruleFound){
              //Get action, speech response and options from Api.ai
              qapi.apiAi(speech, function(response){
                if(response.status.code != "200"){
                  qSay(international.getGUIText("Sorry I didn't get that"), function(){
                    callBack();
                  });
                }else{
                  var speechResponse = response.result.fulfillment.speech;
                  if(speechResponse != null){
                    qSay(speechResponse, function(){
                      callBack();
                    });
                  }else{
                    qSay('OK', function(){
                      callBack();
                    });
                  }
                  //Search extension to process action and return
                  for(var i = 0; i < data.length; i++){
                        var ruleData = data[i];
                        var link = "../rules/" + ruleData["name"] + "/desktop.js";
                        var Rule = require(link);
                        Rule.processSpeech(response.result.action, response.result.parameters, response.result.metadata.emotion,speech, function(ruleRes){
                          if(ruleRes['done'] == true){
                            actionRuleFound = true;
                            return;
                          };
                        });
                    }
                }
              });
      		}
  		});
  }

  /*
  *
  *     Loop
  *
  */
  $(document).ready(function(){
    //Prepare speaker
    var voices = window.speechSynthesis.getVoices();
    speakerMessage.voice = voices[2];

    //Prepare listeners
    mainListener.isListening = false;
    wakeUpListener.isListening = false;

    //prepare speech div
    speechDiv = document.getElementById('speech');

    qSay(international.getGUIText('How can I help you'), function(){
      //Loop start
      startMainVoiceLoop();
    });


    //UI processing
    $(".speechBtn").click(function(){
			if(wakeUpListener.isListening){
				//wakeup
        wakeUpListener = new webkitSpeechRecognition();
        speechDiv.innerHTML = international.getGUIText('Speak ...');
        $(".speechBtn").css("-webkit-filter","invert(0%)");
        $('.userTextInput').hide('drop', 100);
        up();
			}else{
        //stop
        mainListener = new webkitSpeechRecognition();
        wakeUpListener = new webkitSpeechRecognition();
        speechDiv.innerHTML = international.getGUIText('Say hello');
        $('.userTextInput').show('drop', 100);
				$(".speechBtn").css("-webkit-filter","invert(0%)");
        startMainVoiceLoop();
			}
		});
    $(".userTextInput").change(function() {
      var request = $('.userTextInput').val();
      afterGetSpeech(request);
    });
  });


  /*
  *
  *     function definition
  *
  */

  //wait for wake up command
  function waitForWakeup(wakeupCommand, callback) {
    if(wakeUpListener.isListening){
      wakeUpListener = new webkitSpeechRecognition();
    }
		wakeUpListener.isListening = false;
		wakeUpListener.lang = qapi.getUserLang();
		wakeUpListener.continuous = true;
		wakeUpListener.interimResults = true;
		wakeUpListener.onresult = function(event){
			if (event.results.length > 0) {
					var result = event.results[event.results.length-1];
						if(result[0].transcript.contains(wakeupCommand)){
							wakeUpListener.abort();
							wakeUpListener.isListening = false;
              callback();
						}
			}
		}
		wakeUpListener.start();
		wakeUpListener.isListening = true;
  }
  function speechToText(notFinal, callback){
    if(mainListener.isListening){
      mainListener = new webkitSpeechRecognition();
    }
    mainListener.isListening = false;
    mainListener.lang = qapi.getUserLang();
    mainListener.onresult = function(event){
      if (event.results.length > 0) {
					var result = event.results[event.results.length-1][0].transcript;
          if (event.results.length > 0) {
              var result = event.results[event.results.length-1];
              if(result.isFinal) {
                mainListener = new webkitSpeechRecognition();
                mainListener.isListening = false;
                callback(result[0].transcript);
              }else{
                notFinal(result[0].transcript + "...");
              }
          }
			}
    }
    mainListener.start();
		mainListener.isListening = true;
  }
  function qSay(phrase, callback){
    speakerMessage.text = phrase;
    if(qapi.getUserLang() == "en"){
      speakerMessage.lang = "en-UK";
    }else{
      speakerMessage.lang = qapi.getUserLang();
    }
    speakerMessage.onend = function(event){
      callback();
    };
    speechSynthesis.speak(speakerMessage);
  }
})();
