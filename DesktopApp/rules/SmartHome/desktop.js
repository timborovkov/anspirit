	exports.processSpeech = function(speech, callback){
	     var toRet = {'done':false};
	     //if done is false, rule search will be continued.
      //if done is true, action must be performed, because rule search/executing will be done.
	    callback(toRet);
	}
	exports.processAction = function(action, parameters, speech, emotion, callback){
	     var toRet = {'done':false};
	     //if done is false, rule search will be continued.
       //if done is true, action must be performed, because rule search/executing will be done.
	    callback(toRet);
	}
