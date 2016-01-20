exports.runRule = function(speech, action, parameters){
	if(action != null && action != "input.unknown"){
		if(action.contains("smarthome")){
			if(action.contains("lights_on")){
				if(parameters.location == null){
					alert("Lights on here");
				}else{
					alert("Lights on in " + parameters.location);
				}
			}else if(action.contains("lights_off")){
				if(parameters.location == null){
					alert("Lights off here");
				}else{
					alert("Lights off in " + parameters.location);
				}
			}
		}
	}else{
		switch(getUserLang()){
			case "en":
				if(speech.contains("light")){
					if(speech.contains("on")){
						alert("Light on");
					}else if (speech.contains("off")) {
						alert("Light off");
					}
				}
				break;
			case "ru":
				if(speech.contains("свет")){
					alert("Light")
				}
				break;
			case "fi":
				break;
			default:
				break;
		}
	}
}
