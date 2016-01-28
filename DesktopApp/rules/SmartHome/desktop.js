exports.processAction = function(speech, action, options, callback){
	var toReturn = {'used': null};
	if(callback){callback()}
	return toReturn;
}

exports.processSpeech = function(speech, callback){
	var toReturn = {'action': null, 'options': null};
	if(callback){callback()}
	return toReturn;
}
