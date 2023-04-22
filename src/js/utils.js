
var users = {}
var shotKey = ' '
let timerCount = 120000;  //in seconds
var logUser;
var isUserLoggedIn = false;
var playerImagePath = "./Resource/images/spaceship1.png";
var mute =false;

users['p'] = {
    'username': 'p',
    'pass': 'p',
    'firstname': 'P',
    'lastname': 'Test',
    'Email': 'test@gmail.com',
    'Birthdate': '01/01/2000',
    'scoreboard': [],
}


$(document).ready(function() {
    welcome();
});


function welcome() {
    hide();
    // resizeGameBoard();
    $("#welcome").show();
}




const pageSwitch = (tab) => {
	hide();
	$(tab).show();
  };


  const hide = () => {
	$('#welcome').hide();
	$('#register').hide();
	$('#login').hide();
    $('#Configuration').hide();
    $('#game').hide();



	// $('#settings').hide();
	// $('#game-section').hide();
	// if(gameOn){
    //     if(!song.paused){
    //         song.pause();
    //         song.currentTime = 0;

    //     }
    //     Stop();
	// 	gameOn = false;
    //     ghostsLocs={};
    //     ghostsCounter=0;
    //     lives=5;
    //     maxScore=0;
    //     score=0;
	// }
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
    pageSwitch("#game");
    setupGame();
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
        mute = true;
        sound.pause();
        sound.currentTime = 0;
    }
        }

function playSound(sound, resource=true) {
    if(!resource){
        sound = backgroundSound;
    }
    if(mute){
        sound.play();
        mute = false;
    }
}


function backtoConfig() {

        // to do if game on
        pageSwitch("#Configuration");


}
