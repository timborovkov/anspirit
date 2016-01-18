exports.runRule = function(speech){

	if(speech.contains('hub')){
		say('Cozify support is not yet available')
		return true
	}

	return false;
}