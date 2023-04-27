
var users = {}
var shotKey = ' '
let timerCount = 120000;  //in seconds
var logUser;
var isUserLoggedIn = false;
var playerImagePath = "./Resource/images/spaceship1.png";
var mute =true;

users['p'] = {
    'username': 'p',
    'pass': 'testuser',
    'firstname': 'P',
    'lastname': 'Test',
    'Email': 'test@gmail.com',
    'Birthdate': '01/01/2000',
    'scoreboard': [],
}


$(document).ready(function() {
    welcome();
    addEventListenerAlerts();
});


function welcome() {
    hide();
    // resizeGameBoard();
    pageSwitch("#welcome");
    // $("#welcome").show();
}




const pageSwitch = (tab) => {
	hide();
	$(tab).show();
    game.pause = true
    stopSound(null,false)
  };


  const hide = () => {
	$('#welcome').hide();
	$('#register').hide();
	$('#login').hide();
    $('#Configuration').hide();
    $('#game').hide();
    $('#leaderboard').hide();





    


  };


  async function setKey(){
	return new Promise((resolve) => {
		document.addEventListener("keydown", onKeyHandler);
		function onKeyHandler(e){
			document.removeEventListener("keydown", onKeyHandler);
			resolve();
            shotKey = String.fromCharCode(e.which).toLowerCase();
            // console.log(shotKey)
            if(shotKey === 'space'){
                shotKey = ' ';
            }


            // shotKey = e.which;
            if (e.which === 32) {
                $("#key-shot").text("Space");
            }
            else
            $("#key-shot").text(e.key);
		}
	});
}

function setSettings(){
    const timer = parseInt(document.getElementById('rangeVal').value)*1000;
    timerCount = timer;
    setTimeout(() => {
        pageSwitch("#game");
        setupGame();
        backgroundSound.currentTime = 0;

    }, 500);

    return false;

}

function resizeGameBoard(){
    const gameBoard = document.getElementById("gameContainer");
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const gameBoardWidth = screenWidth * 0.8;
    const gameBoardHeight = screenHeight*0.8;

    gameContainer.style.top = `${screenHeight / 2 - gameBoardHeight / 2}px`;
    gameContainer.style.left = `${screenWidth / 2 - gameBoardWidth / 2}px`;
}


function changePlayer(path, img){
    switch (img) {
        case 1:
            document.querySelector('#spaceShip1').style.boxShadow = '0 0 20px rgba(0, 174, 255, 0.5)';
            document.querySelector('#spaceShip2').style.boxShadow = 'none';
            document.querySelector('#spaceShip3').style.boxShadow = 'none';


            break;
        case 2:
            document.querySelector('#spaceShip1').style.boxShadow = 'none';
            document.querySelector('#spaceShip2').style.boxShadow = '0 0 20px rgba(0, 174, 255, 0.5)';
            document.querySelector('#spaceShip3').style.boxShadow = 'none';

            break;
        case 3:
            document.querySelector('#spaceShip1').style.boxShadow = 'none';
            document.querySelector('#spaceShip2').style.boxShadow = 'none';
            document.querySelector('#spaceShip3').style.boxShadow = '0 0 20px rgba(0, 174, 255, 0.5)';
            break;

    }
    playerImagePath = path;
}

function loadSound(soundPath, loop=false) {
			// create an Audio object and set its source file
			let audio = new Audio(soundPath);
            if(loop){
                audio.loop = true;
            }
            return audio;
		}

function stopSound(sound, resource=true) {
    if(!resource){
        sound = backgroundSound;
    }

    if(!mute){
        $('#muteBtn').hide();
        $('#playBtn').show();
        mute = true;
        sound.pause();
    }
        }

function playSound(sound, resource=true) {
    if(!resource){
        sound = backgroundSound;
    }
    if(mute){
        $('#muteBtn').show();
        $('#playBtn').hide();
        sound.play();
        mute = false;
    }
}


function updateLeaderBoardTable(scores, username){
    // Clear the existing score table rows
    const tbody = document.querySelector("#leaderboard-table tbody");

    tbody.innerHTML = "";
    
    // Add a row for each score
    scores.forEach((score, index) => {
      const tr = document.createElement("tr");
      const rankTd = document.createElement("td");
      const nameTd = document.createElement("td");
      const scoreTd = document.createElement("td");
      
      rankTd.innerText = index + 1;
      nameTd.innerText = score.time;
      scoreTd.innerText = score.score;
      tr.appendChild(rankTd);
      tr.appendChild(nameTd);
      tr.appendChild(scoreTd);
      tbody.appendChild(tr);
    });
  }




function backtoConfig() {
        // to do if game on
        // swal("Do you want to start a new game? your score will be lost and you'll go back to settings page", "confirm", "warning");



        // pageSwitch("#Configuration");


}


//for getting the datetime of the game
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}


function addEventListenerAlerts(){

document.querySelector('#playButton').addEventListener('click', function(e){
    // var btn = this;
    e.preventDefault();

    if(game.active && !game.pause){
    swal({
        title: "Are you sure?",
        text: "your score will be lost and you'll go back to settings page",
        icon: "warning",
        buttons: [
          'No, back to game!',
          'Yes, I am sure!'
        ],
        dangerMode: true,
      }).then(function(isConfirm) {
        if (isConfirm) {
            pageSwitch("#Configuration");

        } 
        else {

        }
      })
  }
    else{
        pageSwitch("#Configuration");
    }
});
}