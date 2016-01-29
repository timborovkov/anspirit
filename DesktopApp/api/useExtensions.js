exports.runAction = function(action, rulePaths){
  for (var i in rules) {
    var rule = require(rules[i])
    rule.main(finalValue, function(){

    })
  }
}
exports.getRulePaths = function(){
  var rules = [];
  $.getJSON( "../rules.json", function( data ) {
  	$.each( data, function( key, val ){
  		rules.push("../rules/" + val.name + "/desktop.js");
  	});
  });
  return rules;
}
