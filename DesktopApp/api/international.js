var translates = [];
var textOnGUI = ""
exports.textOnGUI = function(){return textOnGUI;};
exports.prepareTranslates = function(callback){
  $.getJSON( "./translations.json", function( data ) {
    translates = data;
    callback();
  });
}
exports.getGUIText = function(word){
  if (getUserLang() == "en") {
    textOnGUI = word;
  }else{
    $.each(translates, function(engWord, translations){
      if(engWord == word){
        $.each(translations, function(key, val){
          if(key == getUserLang()){
            textOnGUI = val;
            return;
          }
        });
      }
    });
  }
  return textOnGUI;
}
