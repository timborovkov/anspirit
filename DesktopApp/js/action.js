var rules = []
rules.push("./rules/main.js")
$.getJSON( "./rules.json", function( data ) {
	$.each( data, function( key, val ){
		rules.push("./rules/" + val.name + ".js")
	});
});

console.log(rules)

//main processing
var pr = function(finalValue){
	rec_done = true
	for (var i in rules) {
		var rule = require(rules[i])
		if (rule.runRule(finalValue)){

			return
		}
	}
}
