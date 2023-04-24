




function registrationValidation() {

    var userName = document.getElementById("registrationFormUserName");
    var password = document.getElementById("registrationFormPassword");
    var confirmPassword = document.getElementById("registrationFormConfirmPassword");
    var firstName = document.getElementById("registrationFormFirstName");
    var lastName = document.getElementById("registrationFormLastName");
    var email = document.getElementById("registrationFormEmail");
    var birthdate = document.getElementById("registerFormBirthDate");

    error.innerHTML = "";


    if (users[userName.value] !== undefined) {
        error.innerHTML = "User already exist.";
        return false;
    }
    // if (userName.value === "" || password.value === "" || firstName.value === "" || lastName.value === "" || email.value === "" || birthdate.value === "") {
    //     error.innerHTML = "Some fields are empty.";
    //     return false;
    // }

    if (password.value.length < 8) {
        error.innerHTML = "Password must be at least 8 characters";
        return false;
    }

    if(password.value !== confirmPassword.value){
        error.innerHTML= "Passwords do not match!";
        return false;
    }

    if (!alphanumeric(password)) {
        error.innerHTML= "Password must contain letters and numbers";
        return false;
    }

    if (!alphbet(firstName) || !alphbet(lastName)) {
        error.innerHTML="Username must not contain numbers";
        return false;
    }
    console.log("Registration successful!");
    const newUser = {'username': userName.value, 'pass': password.value, 'firstname': firstName.value, 'lastname': lastName.value, 'Email': email.value, 'Birthdate': birthdate.value, 'scoreboard': []};
    registerUser(newUser, userName.value);
    swal("Success!", "Registration successful!", "success");
    let oldForm = $("#registration");
    oldForm[0].reset();
    $("#register").hide();
    $("#login").show();
    return false;
}



// Function to check letters and numbers
function alphanumeric(inputtxt)
{
var letterNumber = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
//  var letterNumber = /^[0-9a-zA-Z]+$/;
 if((inputtxt.value.match(letterNumber))){
    return true;
 } 
else
  { 
   return false; 
  }
  }



function alphbet(inputtxt)
{
 var letterNumber = /^[a-zA-Z]+$/;
 if((inputtxt.value.match(letterNumber))){
    return true;
 } 
else
  { 
   return false; 
  }
  }


function registerUser(newUser, username) {
    users[username] = newUser;
    }

