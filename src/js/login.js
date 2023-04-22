

function validateUser(userName, password) {
    if (users[userName] !== undefined) {
        if (users[userName]['pass'] === password) {
            return true;
        }
    }
    return false;
}


function loggedInUser() {

    var userName = document.getElementById("loginFormUserName").value;
    var password = document.getElementById("loginFormPassword").value;
    if(!isUserLoggedIn){
    if (validateUser(userName, password)) {
        var user = users[userName]['firstname'];
        swal("Welcome " + user +"!", "You are now logged in", "success");
        logUser = users[userName];
        isUserLoggedIn = true;
        pageSwitch("#Configuration");
        replaceLogOut();
        return false;
    }
    else {
        swal("Error", "Invalid username or password", "error");
        return false;
    }
    }
    else{
        swal("Error", "User already logged in", "error");
        return false;
    }


}


function replaceLogOut(){
    const logoutBtn = $("#logoutBtn");
    const loginBtn = $("#loginBtn");
    const playBtn = $("#playButton");
    const welcomeBut = $("#welcomeBtn");
    welcomeBut.hide();
    playBtn.show();
    logoutBtn.show();
    loginBtn.hide();
}

function replaceLogIn(){
    const logoutBtn = $("#logoutBtn");
    const loginBtn = $("#loginBtn");
    const playBtn = $("#playButton");
    const welcomeBut = $("#welcomeBtn");
    playBtn.hide();
    welcomeBut.show();
    isUserLoggedIn = false;
    logUser = null;
    logoutBtn.hide();
    loginBtn.show();
    pageSwitch("#welcome");

}