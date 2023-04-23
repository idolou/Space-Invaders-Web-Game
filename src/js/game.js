var canvas;
var c;
//
var scoreEl;
var stopwatchEl;
var lifeBar;
//
var player;
var projectiles;
var grids;
var InvaderProjectiles;
var particles;
//
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
var canvasWidth = screenWidth;
var canvasHeight = screenHeight*0.88;
//
var frames;
//
var backgroundSound = new Audio("./Resource/sounds/backgroundMusic.mp3");
//
var randomPlayerPosition;
var randomIntervalGrid;
//Game
var game = {
    over: false,
    active:true,
    lives: 3,
    pause : false
}
//score
var score = 0;
//shoots
var playerLastShotTime;
//clock
var startTime;
var isStopwatch = false;
var relateTime = null;
//velocoty changing
var velocityChangeRate = 2
var velocityIncreaseCountProj = 0;
var velocityIncreaseCountGrid = 0;
var projectileSpeed = 5; // adjust this value to change the speed of the projectiles
var velocityIncreaseInterval = 5000; // increase velocity every 5 seconds
var gridSpeedIncreaseCount = 0;
var lastVelocityIncreaseTime = 0;
var gridStartVelocity = 4;
//pressed keys- event listener
var keys;
var backgroundAnimationVelocity = 0.7;






function resetGame(){
    // LETS
    frames = 0
    randomIntervalGrid = 99999999999999999999999999999
    game = {
    over: false,
    active:true,
    lives: 3,
    pause : false
    }
    score = 0
    playerLastShotTime = 0;
    startTime;
    isStopwatch = false

    relateTime = null;
    velocityChangeRate = 2
    velocityIncreaseCountProj = 0;
    velocityIncreaseCountGrid = 0;
    projectileSpeed = 5; // adjust this value to change the speed of the projectiles
    velocityIncreaseInterval = 5000; // increase velocity every 5 seconds

    gridSpeedIncreaseCount = 0;
    lastVelocityIncreaseTime = 0;


    keys = {
        arrowDown: {
            pressed: false
        },
        arrowUp: {
            pressed: false
        },
        arrowLeft: {
            pressed: false
        },
        arrowRight: {
            pressed: false
        },
        space: {
            pressed: false
        }
    }
    
    canvasWidth = screenWidth;
    canvasHeight = screenHeight*0.88;

    try{

        canvas = document.querySelector('canvas');
        c = canvas.getContext('2d');
        c.globalCompositeOperation='destination-over';
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.top = `7%`;
        canvas.style.left = `${screenWidth / 2 - canvasWidth / 2}px`;
    
    
    
    
        player = new Player();
        projectiles = [];
        grids = [];
        InvaderProjectiles = [];
        particles = [];
        addGameListeners();
        backgroundAnimation();
        startTime = Date.now();
        lifeBar = new Image();
        let liveBar_StringImage = "./Resource/images/heart3.png";
        lifeBar.src = liveBar_StringImage;
        const scale = canvas.width * 0.0006;
        c.drawImage(lifeBar, 0, 0, lifeBar.width, lifeBar.height, 10, 10, lifeBar.width*scale, lifeBar.height*scale);
        //playSound(backgroundSound)
        //backgroundSound.play();
        }
        catch(err){
            console.log(err);
        }

}

function setupGame(){
    setTimeout(() => {
    resetGame()
    playSound(backgroundSound)
    animate();
    // console.log(grids[0].velocity)
    }, 200);
}




class Player{
    constructor(){
        this.velocity = {
           x: 0,
           y: 0 
        }

        this.rotation = 0
        this.opacity = 1

        const image = new Image()
        image.src = playerImagePath;
        image.onload = () =>{
            const scale = canvas.height*0.00018;
            this.image= image
            this.width = image.width * scale
            this.height = image.height * scale

            randomPlayerPosition = getRandomInt(canvas.width- this.width)




            this.position = {
                x: randomPlayerPosition,
                y: canvas.height - this.height - 20
            }
        }

    }
    
    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
            )

        c.rotate(this.rotation)

        c.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
            )

        c.drawImage(
            this.image,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            ) 
            
            c.restore()
        }

        

    update(){
        if(this.image){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}


class Projectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        
        this.radius = 6
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle{
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity
        
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades =  fades
    }

    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.fades){
            this.opacity -= 0.01
        } 
    }
}


class InvaderProjectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        
        this.width = 4
        this.height = 12
    }

    draw(){
        c.fillStyle = 'yellow'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
    }
}

class Invader{
    constructor({position, prize, line}){
        this.velocity = {
           x: 0,
           y: 0 
        }
        const image = new Image()
        let stringImage = "./Resource/images/enemy"+String(line + 1)+".png"
        image.src = stringImage
        image.onload = () =>{

            const scale = canvas.height*0.00020;
            this.image= image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y+30
            }
        }
        this.prize = prize
    }
    
    draw(){

        c.drawImage(
            this.image,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            ) 
        }

    
    update({velocity}){
        if(this.image){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }


    shoot(InvaderProjectiles, projectileSpeed) {
        // check if there are no projectiles or if the last projectile has passed 75% of the screen
        const lastProjectile = InvaderProjectiles[InvaderProjectiles.length - 1];
        //let projectileSpeed = 5; // adjust this value to change the speed of the projectiles
        const screenHeight = canvas.height;
        const shootThreshold = screenHeight * 0.75;
      
        if (!lastProjectile || lastProjectile.position.y > shootThreshold) {
          InvaderProjectiles.push(
            new InvaderProjectile({
              position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height,
              },
              velocity: {
                x: 0,
                y: projectileSpeed,
              },
            })
          );
        }
      }
}


class Grid{
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        
        this.velocity = {
            x: gridStartVelocity,
            y: 0
        }

        this.invaders = []

   
        const cols = 5
        const rows = 4

        var invaderWidth = 500;
        const scale = canvas.height*0.00020;
        const scaleWidth = invaderWidth*scale;

        const scaleHeight = invaderWidth*scale;
        
        this.width = cols * scaleWidth;
        

        for(let x =0; x < cols ; x++ ){
            for(let y = 0; y < rows; y++){
                this.invaders.push(new Invader(
                    {position: {
                        x: x * scaleWidth,
                        y: y * scaleHeight},

                    prize: 25 - y * 5,
                    line: y
                    }))}}
    }

    update(){

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x +this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -(this.velocity.x)
        } 
    }
}




function backgroundAnimation(){
for(let i = 0; i < 100 ; i++){
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
           x: 0,
        //    y: 0.7
        y: backgroundAnimationVelocity
        },
        radius: Math.random() * 4,
        color: 'white'
    }))
}
}


function createParticles({object, color, fades}){
    for(let i = 0; i < 10 ; i++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2,
            },
            velocity: {
               x: (Math.random() -0.5) * 2 ,
               y: (Math.random() -0.5) * 2
            },
            radius: Math.random() * 3,
            color: color,
            fades: fades
        }))
    }
}



function updateTime(countTime, isStopwatch) {
    if (startTime !== null && game.active) {
        let elapsedTime = 0;
        if (isStopwatch) {
            elapsedTime = Date.now() - startTime;
        } else {
            elapsedTime = countTime - (Date.now() - startTime - 1000);
        }
        elapsedTime = elapsedTime < 0 ? 0 : elapsedTime; // add this line to set elapsedTime to 0 if it's less than 0

        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        //draw time
        c.font = "25px Berlin Sans FB";
        c.fillStyle = 'white';
        c.fontWeight = 'bold';
        c.fillText("Time: " + timeString, canvas.width-130, 25);



        if (!isStopwatch && elapsedTime <= 0) {

            
            console.log('Time is up!');
            updateScoreBoard(logUser);

            //text
            if(score < 100){
                // Add a message at the center of the screen
                stopSound(backgroundSound);
                soundGo("./Resource/sounds/doBetter.mp3");
                var t = "You can do better!";
                c.font = "120px Berlin Sans FB";
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.fillStylec = 'orange';
                c.fontWeight = 'bold';
                c.fillText(t, canvas.width/2, canvas.height/2);
            }
            else{
                // Add a message at the center of the screen
                stopSound(backgroundSound);
                soundGo("./Resource/sounds/winning.mp3");
                var t = "Winner!";
                c.font = "100px Berlin Sans FB";
                c.fillStylec = 'orange';
                c.fontWeight = 'bold';
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.fillText(t, canvas.width/2, canvas.height/2);

            }
            game.pause = true;
            game.active = false;

            showLeaderBoard(logUser);

        }

        if (seconds % 5 === 0 && seconds !== 0 && gridSpeedIncreaseCount < 4 && Date.now() - lastVelocityIncreaseTime >= 5000) {
            grids.forEach(grid => {
                if (grid.velocity.x >= 0) {
                    grid.velocity.x += velocityChangeRate;

                } else if (grid.velocity.x < 0) {
                    grid.velocity.x -= velocityChangeRate;
                }
            });
            gridSpeedIncreaseCount++;
            lastVelocityIncreaseTime = Date.now();
        }
    }
}



function animate(){
    const maxHightPlayer = canvas.height * 0.6 
    if(!game.active) return

    if(startTime == null){
        startTime = Date.now();
        relateTime = startTime
    }

    if(Date.now() - relateTime >= velocityIncreaseInterval && velocityIncreaseCountProj < 4){
        projectileSpeed += velocityChangeRate
        relateTime = Date.now()
        velocityIncreaseCountProj ++
    }

    //requestAnimationFrame(animate)  



    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, i) => {

        if(particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius 
        }

        if(particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        }else{
            particle.update() 
        }
    })

    //draw hearts
    let liveBar_StringImage = "./Resource/images/heart"+String(game.lives)+".png";
    lifeBar.src = liveBar_StringImage;
    lifeBar.style.zIndex = 1;
    const scale = canvas.width * 0.00045;
    c.drawImage(lifeBar, 0, 0, lifeBar.width, lifeBar.height, 0, 0, lifeBar.width*scale, lifeBar.height*scale)


    //draw score
    c.font = "30px Berlin Sans FB";
    c.fillStyle = 'white';
    c.fontWeight = 'bold';
    c.fillText("Score: " + score, 3, canvas.height-20);



    




    InvaderProjectiles.forEach((InvaderProjectile, index) => {
        if(InvaderProjectile.position.y + InvaderProjectile.height >= canvas.height){
            setTimeout(() => {
                InvaderProjectiles.splice(index, 1)
            }, 0)
        }else InvaderProjectile.update()





        // projectile hits player
        if((InvaderProjectile.position.y <= player.position.y + player.height &&
            InvaderProjectile.position.y + InvaderProjectile.height >= player.position.y &&
            InvaderProjectile.position.x <= player.position.x + player.width &&
            InvaderProjectile.position.x + InvaderProjectile.width >= player.position.x &&
            player.opacity > 0.9)){
                
                game.lives --
                soundGo("./Resource/sounds/explosion.mp3");

                setTimeout(() => {
                    InvaderProjectiles.splice(index, 1)
                    if(game.lives > 0){
                        player.opacity = 0.3
                        console.log('you lost one live')
                        console.log(game.lives)
                        setTimeout(() => {
                            player.opacity = 1
                            player.position.x = randomPlayerPosition;
                            player.position.y = canvas.height - player.height - 20
                            },1000)
                    }

                    //to make the game freeze after ending
                    if(game.lives <= 0){
                        console.log('you lose')
                        updateScoreBoard(logUser);
                        console.log(game.lives)
                        player.opacity = 0.00
                        game.pause = true;

                        setTimeout(() => { 
                            game.active = false;
                            stopSound(backgroundSound);
                            soundGo("./Resource/sounds/loss.mp3");
                            var t = "You Lost!";
                            c.font = "100px Berlin Sans FB";
                            c.fillStylec = 'white';
                            c.fontWeight = 'bold';
                            c.textAlign = "center";
		                    c.textBaseline = "middle";
                            c.fillText(t, canvas.width/2, canvas.height/2);
                            },1500) 

                        showLeaderBoard(logUser);
                    }
                }, 0)

                
                createParticles({
                    object: player, 
                    color: 'red',
                    fades: true
                })
            }
    })




    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0 ){
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
            
        } else{
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        now = Date.now()
        grid.update()

            //spawn projectiles
        if(frames % 10 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(InvaderProjectiles, projectileSpeed)
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({velocity:grid.velocity})

            // projectiles hit enemy

            projectiles.forEach((projectile, j) => {
                if(projectile.position.y - projectile.radius <=
                     invader.position.y + invader.height && 
                     projectile.position.x + projectile.radius >=
                     invader.position.x && projectile.position.x - projectile.radius <=
                     invader.position.x + invader.width && projectile.position.y + projectile.radius >=
                     invader.position.y){

                        setTimeout(() => {
                            const invaderFound = grid.invaders.find((invader2) =>
                                invader2 === invader
                                )
                            const projectileFound = projectiles.find(projectile2 =>
                                projectile2 === projectile
                                )

                                //remove invader & projectile
                            if(invaderFound && projectileFound){
                                soundGo("./Resource/sounds/blaster.mp3");
                                score += invader.prize
                                createParticles({
                                    object: invader, 
                                    color: 'green',
                                    fades: true
                                })

                                grid.invaders.splice(i, 1)
                                projectiles.splice(j, 1)

                                if(grid.invaders.length > 0){
                                    const firstInvader = grid.invaders[0]
                                    const lastInvader = grid.invaders[grid.invaders.length-1]

                                    grid.width = 
                                    lastInvader.position.x - firstInvader.position.x +lastInvader.width
                                    grid.position.x = firstInvader.position.x
                                }
                                // all invaders in grid dead
                                else{
                                    //stop the game and champion message
                                    grids.splice (gridIndex, 1)
                                    setTimeout(() => { 
                                        updateScoreBoard(logUser);
                                        
                                        stopSound(backgroundSound);
                                        soundGo("./Resource/sounds/winning.mp3");
                                        game.active = false;
                                        game.pause = true;
                                        showLeaderBoard(logUser);

                                        //text
                                        var t = "Champion!";
                                        c.font = "125px Berlin Sans FB";
                                        c.fillStyle = 'orange';
                                        c.fontWeight = 'bold';
                                        c.textAlign = "center";
                                        c.textBaseline = "middle";
                                        c.fillText(t, canvas.width/2, canvas.height/2);

                                    },1000)   
                                }
                            }
                        }, 0)
                     }
            })
        })
    })

    


    
    //----NEW ---------
    //player moving
    if(player.opacity > 0.9){

        if(keys.arrowDown.pressed && player.position.y <= canvas.height - player.height) {
            player.velocity.y = 3;
            // console.log("moving down");
        } else if(keys.arrowUp.pressed && player.position.y >= maxHightPlayer) {
            player.velocity.y = -3;
            // console.log("moving up");
        } else {
            player.velocity.y = 0;
        }
    
        if(keys.arrowLeft.pressed && player.position.x >= 0) {
            player.velocity.x = -5;
            player.rotation = -0.15;
            // console.log("moving left");
        } else if(keys.arrowRight.pressed && player.position.x <= canvas.width - player.width) {
            player.velocity.x = 5;
            player.rotation = 0.15;
            // console.log("moving right");
        } else {
            player.velocity.x = 0;
            player.rotation = 0;
        }
    }



    //player shoots

    if (keys.space.pressed && Date.now() - playerLastShotTime > 300 && game.lives > 0 && player.opacity > 0.9){
        projectiles.push(new Projectile({
            position:{
                x: player.position.x + player.width / 2,
                y: player.position.y - 10
            },
            velocity: {
                x: 0,
                y: -4
            }
        }) )
        playerLastShotTime = Date.now();
    }

    // spawn grids
    const maxNumGrid = 1
    if (frames % randomIntervalGrid  === 0 && grids.length < maxNumGrid){
        grids.push(new Grid())
        randomIntervalGrid = Math.floor((Math.random() * 500) + 500)
        frames = 0
    }
    frames++
    //setInterval(updateStopwatch, 1000);
    setInterval(updateTime(timerCount,isStopwatch), 1000);

    if(!game.pause){requestAnimationFrame(animate) }

}





function addGameListeners(){
addEventListener('keydown', ({key}) => {
    //(when dead)
    if(game.over) return

    switch(key){
        case 'ArrowDown':
            console.log('down')
            keys.arrowDown.pressed = true
            break
        case 'ArrowUp':
            //console.log('up')
            keys.arrowUp.pressed = true
            break
        case 'ArrowLeft':
            //console.log('left')
            keys.arrowLeft.pressed = true
            break
        case 'ArrowRight':
            // console.log('right')
            keys.arrowRight.pressed = true
            break
        case shotKey:
            keys.space.pressed = true
            break
    }   
})

addEventListener('keyup', ({key}) => {
    switch(key){
        case 'ArrowDown':
            //console.log('down')
            keys.arrowDown.pressed = false
            break
        case 'ArrowUp':
            //console.log('up')
            keys.arrowUp.pressed = false
            break
        case 'ArrowLeft':
            //console.log('left')
            keys.arrowLeft.pressed = false
            break
        case 'ArrowRight':
            //console.log('right')
            keys.arrowRight.pressed = false
            break
        case shotKey:
            //console.log('space')
            keys.space.pressed = false
            break
        case 'p':
            console.log('p out')
            break
    }   
})
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function soundGo(soundPath){
    if (!mute){
        var sound = new Audio(soundPath);
        sound.volume = 0.6;
        sound.play();
    }
}


function updateScoreBoard(user){
    var datetime = new Date().today() + " - " + new Date().timeNow();
    users[user].scoreboard.push({ 'time': datetime, 'score': score});
    users[user].scoreboard.sort((a, b) => {
        return b.score - a.score;
      });

}

function showLeaderBoard(user){
    updateLeaderBoardTable(users[user].scoreboard, users[user].username);

    setTimeout(function() {
        pageSwitch('#leaderboard');
        
      }, 3000); // 3000 milliseconds = 3 seconds




}
