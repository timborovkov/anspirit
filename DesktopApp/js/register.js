$ = require('jquery');

function register(){
	var email = $('#reg_email').val()
	var password = $('#reg_pass').val()
	var p2 = $('#reg_pass2').val()
	var age = $('#reg_age').val()
	var name = $('#reg_name').val()

	if(!validateEmail(email)){
		sweetAlert("Oops...", "Wrong email!", "error");
	}
	else if(password != p2) {
		sweetAlert("Oops...", "Passwords doesn't match!", "error");
	}
	else if(password.length < 5){
		sweetAlert("Oops...", "Password too short!", "error");
	}
	else if(!isInt(age) || age < 5 || age > 100) {
		sweetAlert("Oops...", "Wrong age!", "error");
	}
	else if(name.length > 70 || name.length < 1) {
		sweetAlert("Oops...", "Wrong name!", "error");
	}else{
		$.ajax({
	    type: "post",
	    url: getServer() + '/register.php',
	    data: {'email': email, 'password': password, 'name': name,'age': age},
	    success: function(data){
	      if (data.done){
	      	sweetAlert("Congrats!", "Now you officialy our friend!", "success");
	      	$(location).attr('href','file://' + __dirname + '/index.html')
	      }else{
	      	sweetAlert("Oops...", "Something went wrong!", "error");
	      }
	    },
	    error: function(a, error){
	      console.log(error);
	      sweetAlert("Oops...", "Something went wrong!", "error");
	    },
	    dataType: "json"
	  	});
	  }
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}
