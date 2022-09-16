console.log('js is linked and working')

//make a simple crawler game using HTML5's canvas tag and the associated properties of that tag, that we can manipulate with javascript.

//we need two entities, a hero and an agre
//the hero should be moveable with the WASD or arrow keys
//the ogre should be stationary
//the hero and ogrey should be able to collide to make something happen
//when the hero and ogre collide, the ogre is removed from the canvas, and the game stops, and sends a message to our user that they have won. 

//the canvas is the middle gray box of the screen inside the red box. 

// 1.) first things first = first, grab our elements so we can manipulate them later. 

const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const message = document.getElementById('status')

//3.) we need to set the game's context to be 2d
//we also SAVE that context to the ctx variable
//this tells our code, to do whatever we want it to do in the context of the canvas area. 
const ctx = game.getContext('2d')

// console.log('movement', movement)
// console.log('message', message)
console.log('game', game)

// message.innerText = 'full from lunch'

//2.) one thing we need to do, is get the computed size of our canvas
//this is because the canvas could have different sizes on different screens
//and we need to be able to access the exact size of the canvas, in order to make this function like a game should. 
//we do that, with the following lines of code:
//we need to set the attributes width and height according to how the canvas displays

//you need to setAttribute before you can get the style. 
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

console.log('this is the game element', game)

// //fillStyle is built in and sets a color to fill whatever shape you're drawing
// ctx.fillStyle = 'green'
// //the fillRect takes 4 arguments in this order
// //(xCoord, yCoord, width, height)
// //these units are in pixels
// ctx.fillRect(10, 10, 100, 100)


//making hero object
//notice this, the method uses fucntion expression syntax
//using the keyword function, 
//NOT an arrow function
//this is bc one of the primary difference between a named function with the keyword and an arrow function is the context that "this" refers to. 
//can't use arrow function with 'this.----'. 
//can't use arrow function w/ methods on objects
// const hero = {
//     x: 10, 
//     y: 10, 
//     color: 'hotpink',
//     height: 20, 
//     width: 20, 
//     alive: true, 
//     render: function() {
//         ctx.fillStyle = this.color
//         ctx.fillRect(this.x, this.y, this.width, this.height)
//     }
// }
//example of how to make your hero show up on the canvas
// hero.render()

//example of an ogre object
// const ogre = {
//     x: 200,
//     y: 100, 
//     color: '#bada55', 
//     width: 60, 
//     height: 120, 
//     alive: true, 
//     render: function () {
//         ctx.fillStyle= this.color
//         ctx.fillRect(this.x, this.y, this.width, this.height)
//     }
// }
//how to make it come up on the canvas
// ogre.render()

//Becauase our two crawlers (those are the guys that move around) are build of the key/value pairs, we can use a javascript class to build them.

class Crawler {
    //we need a constructor function in order to make differences between instances of this class. 
    constructor(x, y, color, width, height) {
        this.x = x, 
        this.y = y,
        this.color = color,  
        this.width = width, 
        this.height = height, 
    //we can hard set values inside the constructor as well
    this.alive = true, 
    //we can even set methods inside the constructor
        this.render = function() {
            ctx.fillStyle = this.color 
            ctx.fillRect(this.x, this.y, this.width, this.height) 
        }   
    }
}

const player = new Crawler(10, 10, 'lightsteelblue', 16, 16)
let ogre = new Crawler(200, 50, '#bada55', 32, 48)

// player.render()
// ogre.render()    

// 4.) now we're going to set up our movement handler funcation
//this will tell our code how our player moves around, and what keys to use to move them
//this functionhas to be tied to an event handler
const movementHandler = (e) => {
    //this move handler will be associated with a keydown event ( e is for event)
    //we're going to use keycodes to tell it to do different movements for different keys
    //here are some keycodes: 
    // w = 87, a = 65, s = 83, d = 68
    //up = 38, left = 37, down = 40, right = 39
    //we COULD use if statements for this, but there is another syntax that's a little bit shorter called a SHORT CASE
    switch(e.keyCode) {
        //we can use multiple cases here for multiple keys to trigger the same event

        // move up 
        case (87):
        case (38):
            //this will move the character up 10px every press
            player.y-= 10
            //we also need to break our cases like this
            break
        //move left
        case (65):
        case (37):
            //this moves the player to the left
            player.x -=10
            break
        //move down
        case (83):
        case (40):
            //this moves player down 
            player.y +=10
            break
        //move right
        case (68):
        case (39):  
            //this moves player to the right
            player.x +=10
            break
    }
}

//hero and ogre should be able to collide to make something happen
//we're going to call a function that does that for us
//to accurately detect a hit, we need to account for the entire space taken up by each object.
//we need to use the hero's x, y, w, h as well as shrek's x, y, w, and h
const detectHit = () => {
    //we're basically using one big if statement to cover all our bases
    //that means judging the player and ogre's x, y, width and height values
    //It's measuring if any portion of the hero's box intersects with any portion of the ogre's box. 
    if(player.x < ogre.x + ogre.width
        && player.x + player.width > ogre.x
        && player.y < ogre.y + ogre.height
        && player.y + player.height > ogre.y) {
            //console.log('WE HAVE A HIT!')
            //if we have a hit, shrek dies
            //the game winner is announced
            ogre.alive = false
            //the game winner is announced
            message.textContent = 'You win!'
        }
}


//we're going to set up a gameLoop function
//this will be attached to an interval 
//this is how we will create animation in our canvas

const gameLoop = () => {

    if (ogre.alive) {
        detectHit()
    }
    //make sure you don't have any console.logs in here

    //you need to erase the old frame so they don't stack on top of one another
    //rn it was just creating a new frame every 60 seconds and not clearing out old frame

    //here we'll use another built in canvas method
    //this is called clearRect, and it clears rectangles, so the old frames don't stack up on one another
    //just like fillRect fills rectangles
    //here, we want to clear out the ENTIRE canvas every single frame
    //changes what is visually shown on the canvas for every single frame

    //width and height are the canvas's width and height
    //makes it look like the little square is moving around the screen
    ctx.clearRect(0, 0, game.width, game.height)

    movement.textContent = player.x + ", " + player.y
    player.render()

    if (ogre.alive) {
        ogre.render()
    }
}

//now, we're going to attach our movement handler to the keydown event, and we're going to run the gameLoop, and we want to make sure to only do this once all of the DOM content has loaded. 
document.addEventListener('DOMContentLoaded', function() {
    //once the DOM content loads, we can set up our movement event listener
    document.addEventListener('keydown', movementHandler)
    //we can also set up our gameLoop interval
    setInterval(gameLoop, 60)
})




