$(document).ready(function(){
	//Login post form request
  $("#userForm").submit(function(e){
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();
    console.log(email,password);
    $.ajax({
      url : '/user/login',
      data: {
        email : email,
        password : password
      },
      method: "POST",
      success: function(res){
        console.log(res);
      }

    });
  });

  //Register post form request
   $("#userRegForm").submit(function(e){
    e.preventDefault();
    var name = $('#username').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var password2 = $('#password2').val();
    console.log(name,email,password);
    $.ajax({
      url : '/user/register',
      data: {
        name : name,
        email : email,
        password : password,
        password2 : password2
      },
      method: "POST",
      success: function(res){
        if (res.msg=='success') {
          location.href = '/user/home';
        }
        console.log(res);
      },
      error:function(res){
        console.log(res);
      }

    });
  });
});