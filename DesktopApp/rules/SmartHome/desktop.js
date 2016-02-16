
	module.exports.processSpeech = function(speech, cb){
	    var toRet = {done:false};
	    cb(toRet);
	}
	module.exports.processActionFromSpeech = function(action, parameters, speech, emotion, cb){
	     var toRet = {done:false};
			 if(action != null){
				 if(action.contains('smarthome')){
					 $.ajax({
						 type: 'get',
						 url: 'http://localhost:3000/hub',//"http://api.anspirit.net:3000/hub/1",
						 data: {task: {action: action, parameters: parameters}, secret: global.qapi.getUserSecret(), user: global.qapi.getUserId(), hubId: 1},
						 success: function(data){
							 console.log("Data from hub: " + data);
							 toRet.done = true;
							 global.qSay("Done", function(){});
							 cb(toRet);
						 },
						 error: function(a, error) {
							 cb(toRet);
							 console.error(error);
						 }
					 });
				 }else{
						cb(toRet);
				 }
			 }else{
				 cb(toRet);
			 }
	}

	//TODO get hub id for user
