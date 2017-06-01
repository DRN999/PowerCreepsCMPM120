var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', { create: create });

var content = [
    "I overheard the barkeep's conversation with the captain of nightwatch. ",
	"He said something along the lines of . . .",
	". . .",
    "Barkeep: It's going to be a big night, ain't it?",
    "Captain: I sure hope so, 20 years and this is the thanks I get,",
	". . .",
    "It sounds like the guards will be throwing the chief a party, that probably means a less guards on duty tonight.",
    "Should I try to make my way through during the day or at night?",
    "Visibility might be low though . . .",

];

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 75;
var lineDelay = 300;

function create() {

    text = game.add.text(32, 32, '', { font: "18px Arial", fill: "#ffffff" });

    nextLine();

}

function nextLine() {

    if (lineIndex === content.length)
    {
        //  We're finished
        return;
    }

    //  Split the current line on spaces, so one word per array element
    line = content[lineIndex].split(' ');

    //  Reset the word index to zero (the first word in the line)
    wordIndex = 0;

    //  Call the 'nextWord' function once for each word in the line (line.length)
    game.time.events.repeat(wordDelay, line.length, nextWord, this);

    //  Advance to the next line
    lineIndex++;

}

function nextWord() {

    //  Add the next word onto the text string, followed by a space
    text.text = text.text.concat(line[wordIndex] + " ");

    //  Advance the word index to the next word in the line
    wordIndex++;

    //  Last word?
    if (wordIndex === line.length)
    {
        //  Add a carriage return
        text.text = text.text.concat("\n");

        //  Get the next line after the lineDelay amount of ms has elapsed
        game.time.events.add(lineDelay, nextLine, this);
    }

}
