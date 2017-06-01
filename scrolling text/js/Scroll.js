var canvas_width = 1280;
var canvas_height = 720;
var fontHeight= 16;
var game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, 'phaser', { preload: preload, create: create});


function preload() {

    game.load.bitmapFont('Arial', 'assets/fonts/sample.xml.tga');

}


function create() {
    var message = "Glen's Invaders";

    var textObject = game.add.bitmapText(game.world.centerX, 10, 'Arial', message, fontHeight);
    textObject.x = game.width / 2  - textObject.textWidth / 2;

    displayLetterByLetterText(textObject, message, function() {
        // stuff you want to do at the end of the animation
        // eg. this.input.onDown.addOnce(this.start, this);
    });
}


function displayNextLetter() {

    this.textObject.text = this.message.substr(0, this.counter);
    this.counter += 1;

}

function displayLetterByLetterText(textObject, message, onCompleteCallback) {

    var timerEvent = game.time.events.repeat(80, message.length, displayNextLetter, 
                                { textObject: textObject, message: message, counter: 1 });

    timerEvent.timer.onComplete.addOnce(onCompleteCallback, this);

}