exports.runRule = function(speech, callback){
	var r = false;
	if(getUserLang() == 'en' || getUserLang() == 'ru'){
		apiAi(speech, function(result){
				var speechResponse = result["result"]["fulfillment"]["speech"];
				var action = result['result']['action'];
				var options = result['result']['parameters'];

				if(action.contains("smalltalk") || action == null){
					if(speechResponse == ""){
						say("okey");
						console.log(parameters);
					}else{
						say(speechResponse);
					}
				}else{
					processAction(speech, action, options);
				}
		});
	}else if(getUserLang() == "fi"){
		say("Suomen kieli ei vielä toimii")
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
	})
}
