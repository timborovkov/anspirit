(function(){
	$ = require('jquery');
	var qapi = require('../api/qapi.js');
	var speechClass = require("../api/speech.js");
	var international = require("../api/international.js");

	exports.runRule = function(speech, callback){
		processSpeech(speech, callback);
	}
	function processSpeech(speech, callback){
		$.getJSON("./rules.json", function(data) {
			var ruleFound = false;
			for(var i = 0; i < data.length; i++){
				var ruleData = data[i];
				var link = "../rules/" + ruleData["name"] + "/desktop.js";
				var Rule = require(link);
				var ruleRes = Rule.processSpeech(speech);
				if(ruleRes.action != null){
					ruleFound = true;
					processAction(speech, ruleRes.action, ruleRes.options, callback);
					return;
				};
			}
			//No used rules so we can use standart api.ai
			if(!ruleFound){
				qapi.apiAi(speech, function(result){
					var speechResponse = result["result"]["fulfillment"]["speech"];
					var action = result['result']['action'];
					var options = result['result']['parameters'];

					if(action == null){
						if(speechResponse == ""){
							speechClass.say(international.getGUIText('what did you say?'), qapi.getUserLang());
						}else{
							speechClass.say(speechResponse, qapi.getUserLang());
						}
						callback();
					}else{
						speechClass.say(speechResponse, qapi.getUserLang());
						processAction(speech, action, options, callback);
					}
				});
			}
		});
	}
	function processAction(speech, action, options, callback){
		$.getJSON("./rules.json", function(data){
			var ruleFound = false;
			for(var i = 0; i < data.length; i++){
				var ruleData = data[i];
				var link = "../rules/" + ruleData["name"] + "/desktop.js";
				var Rule = require(link);
				var ruleRes = Rule.processAction(speech, action, options);
				if(ruleRes['used']){
					//Done
					ruleFound = true;
					callback();
					return;
				}
			}
			if(!ruleFound){
				callback();
			}
		});
	}
	function standartSpeechResponse(){
		speechClass.say(international.getGUIText("Okey"));
	}
})();
