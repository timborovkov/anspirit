var speakerMessage = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();

var amy = {
  say: function(phrase, callback){
    speakerMessage.text = phrase;
    speakerMessage.lang = "en-US";
    speakerMessage.voice = voices[10];
    speakerMessage.voiceURI = 'native';
    speakerMessage.onend = function(event){
      callback();
    };
    speakerMessage.onerror = function(er){
      callback(er);
    }
    speechSynthesis.speak(speakerMessage);
  }
};
