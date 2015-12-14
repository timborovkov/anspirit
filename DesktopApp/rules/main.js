exports.runRule = function(speech){

	if(speech.contains('hello') || speech.contains('hi')){
		say('Hi')
		return true
	}else if(speech.contains('how are you') || speech.contains('whats up')){
		say('I really enjoy to help you')
		return true
	}else if(speech.contains('platform')){
		say('Here is your platform information')
		alert(getPlatform())
	}else if(speech.contains('open')){
		if (speech.contains('finder')){
			open("~/")
		}else if (speech.contains('browser')){
			open('http://www.google.com');
		}
	}else if(speech.contains('Google')){
		say('OK ,I will go to google')
		open('http://www.google.com');
	}else if(speech.contains('Wikipedia') || speech.contains('wiki')){
		say('OK ,I will go to wiki')
		open('http://www.wikipedia.com');
	}else if(speech.contains('Facebook')){
		say('OK ,I will go to facebook')
		open('http://www.facebook.com');
	}else if(speech.contains('Twitter')){
		say('OK ,I will go to twitter')
		open('http://www.twitter.com');
	}else if(speech.contains('YouTube')){
		say('OK ,I will go to youtube')
		open('http://www.youtube.com');
	}else if(speech.contains('play')){
		if (speech.contains('music')){

		}
	}else if(speech.contains('close')){
		if (speech.contains('active') || speech.contains('this') || speech.contains('current')){
			say('Sorry but this function is not yet supported')
		}
	}

	return false;
}