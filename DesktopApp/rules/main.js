$ = require('jquery');
var qapi = require('../api/qapi.js');

exports.runRule = function(speech, callback){
	var speech = require("../api/speech.js");
	var r = false;
	if(qapi.getUserLang() == 'en' || qapi.getUserLang() == 'ru'){

	}else if(qapi.getUserLang() == "fi"){
		speech.say("Suomen kieli ei vielä toimii")
	}
	callback();
	return r;
}

function processAction(speech, action, options){
	$.getJSON("./rules.json", function(data) {
		for(var i = 0; i < data.length; i++){
			var ruleData = data[i];
			var link = "../rules/" + ruleData["name"] + "/desktop.js";
			var Rule = require(link);
			Rule.runRule(speech, action, options);
		}
	});
}

function processSpeech(speech){
	apiAi(speech, function(result){
			var speechResponse = result["result"]["fulfillment"]["speech"];
			var action = result['result']['action'];
			var options = result['result']['parameters'];

			if(action.contains("smalltalk") || action == null){
				if(speechResponse == ""){
					speech.say("okey");
					console.log(parameters);
				}else{
					speech.say(speechResponse);
				}
			}else{
				processAction(speech, action, options);
			}
	});
}


/*

*/
