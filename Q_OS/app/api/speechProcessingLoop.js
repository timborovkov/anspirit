(function(){

  /*
  *     prepare
  */
  //API
  var qapi = require('../api/qapi.js');
  global.qapi = qapi;
  var international = require('../api/international.js');
  var a = 1;
  //Variables
  var wakeUpListener = new webkitSpeechRecognition();
  var mainListener = new webkitSpeechRecognition();
  var speakerMessage = new SpeechSynthesisUtterance();
  var voices = null;
  var speechDiv = null;
  var lastActionHappened = 0;

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
    $(".speechBtn").css("-webkit-filter","invert(100%)");
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
    lastActionNow();
    doSpeechProcessing(speech, function(){
      $('.speechBtn').show('drop', 80);
      $('.userTextInput').show('drop', 80);
      $('.userTextInput').val("");
      speechDiv.innerHTML = international.getGUIText('Speak ...');
      eval("up()");
    });
  }
  function doSpeechProcessing(speech, callBack){
      // Go through extensions to get action for speech request
      $.getJSON("../rules.json", function(extensions) {
  			  var speechRuleFound = false;
          var firstExtensionsCompletedCount = 0;
  			  for(var i = 0; i < extensions.length; i++){
      				var ruleData = extensions[i];
      				var link = "../rules/" + ruleData["name"] + "/desktop.js";
      				var Rule = require(link);
      				Rule.processSpeech(speech, function(ruleRes){
                if(ruleRes.done == true){
        					speechRuleFound = true;
        				}
                firstExtensionsCompletedCount++
                afterFirstExtensionsAreDone(firstExtensionsCompletedCount);
              });
    			}
          function afterFirstExtensionsAreDone(extensionsCompleted){
            if(extensionsCompleted == extensions.length){
              if(!speechRuleFound){
                  //Get action, speech response and options from Api.ai
                  qapi.apiAi(speech, function(response){
                    if(response.status.code != "200"){
                      qSay(international.getGUIText("Sorry I didn't get that"), function(){
                        callBack();
                      });
                    }else{
                      var speechResponse = response.result.fulfillment.speech;
                      var htmlResponse = response.result.metadata.html;
                      lastActionNow();
                      //Search extension to process action and return
                      var rulesProcessed = 0;
                      var actionRuleFound = false;
                      for(var i = 0; i < extensions.length; i++){
                            var ruleData = extensions[i];
                            var link = "../rules/" + ruleData["name"] + "/desktop.js";
                            var Rule = require(link);
                            rulesProcessed++
                            Rule.processActionFromSpeech(response.result.action, response.result.parameters, response.result.metadata.emotion,speech, function(ruleRes){
                              if(ruleRes.done == true){
                                console.log('Rule used');
                                actionRuleFound = true;
                              }
                              afterSecondExtensionsAreDone(rulesProcessed);
                            });
                        }
                    }
                    function afterSecondExtensionsAreDone(extensionsCompleted){
                      if(extensionsCompleted == extensions.length){
                        if(!actionRuleFound){
                          if(speechResponse != ""){
                            qSay(speechResponse, function(){
                              callBack();
                            });
                          }else if(htmlResponse != ""){
                            qSay(htmlResponse, function(){
                              callBack();
                            });
                          }else{
                            qSay('OK', function(){
                              callBack();
                            });
                          }
                        }else{
                          console.log("Action done");
                          callBack();
                        }
                      }
                    }
                  });
              }
            }
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
        up();
			}else{
        //stop
        mainListener = new webkitSpeechRecognition();
        wakeUpListener = new webkitSpeechRecognition();
        mainListener.isListening = false;
        wakeUpListener.isListening = false;
        speechDiv.innerHTML = international.getGUIText('Say hello');
				$(".speechBtn").css("-webkit-filter","invert(0%)");
        startMainVoiceLoop();
			}
		});
    $(".userTextInput").change(function() {
      var request = $('.userTextInput').val();
      mainListener = new webkitSpeechRecognition();
      mainListener.isListening = false;
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
					  var result = event.results[event.results.length-1][0].transcript;
            console.log("speech: " + result);
						if(result.contains(wakeupCommand)){
							wakeUpListener.abort();
							wakeUpListener.isListening = false;
              callback();
						}
			}
		}
    wakeUpListener.onend = function(event){
      console.log("Wakeup listener has been stoped");
    }
		wakeUpListener.start();
    console.log("Wakeup listener has been started");
		wakeUpListener.isListening = true;
  }
  function speechToText(notFinal, callback){
    if(mainListener.isListening){
      mainListener = new webkitSpeechRecognition();
    }
    mainListener.interimResults = true;
    mainListener.isListening = false;
    mainListener.lang = qapi.getUserLang();
    mainListener.onresult = function(event){
      lastActionNow();
      if (event.results.length > 0) {
					var result = event.results[event.results.length-1][0].transcript;
          console.log(result);
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
  var qSay = function(phrase, callback){
    speakerMessage.text = phrase;
    if(qapi.getUserLang() == "en"){
      speakerMessage.lang = "en-UK";
    }else{
      speakerMessage.lang = qapi.getUserLang();
    }
    speakerMessage.onend = function(event){
      lastActionNow();
      callback();
    };
    speechSynthesis.speak(speakerMessage);
  }
  global.qSay = qSay;

  function lastActionNow(){
    var d = new Date();
    var n = d.getTime();
    lastActionHappened = n;
  }

  //Time executions
  window.setInterval(function(){
    var d = new Date();
    var n = d.getTime();
    if(mainListener.isListening){
      if(lastActionHappened < (n - 8000)){
        //end listening if listening
        mainListener = new webkitSpeechRecognition();
        wakeUpListener = new webkitSpeechRecognition();
        speechDiv.innerHTML = international.getGUIText('Say hello');
				$(".speechBtn").css("-webkit-filter","invert(0%)");
        qSay(international.getGUIText('wake me up if you need me'), function(){
          startMainVoiceLoop();
        });
      }
    }
  }, 100);
})();
