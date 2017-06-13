
var introScreen = function(game){};
introScreen.prototype = {
	create: function() {
		// // narrative introduction: what is core, who are you, why do you need to escape
		lineIndex = 0;
		introText = game.add.text(32, 32, '', {font: "18px Courier New", fill: "#ffffff"});
		this.nextLine();

		var startButton = game.add.button(canvas_width - canvas_width / 3, canvas_height - canvas_height / 5, 'playButton', this.startIntro);
		startButton.anchor.set(0.5);
		startButton.scale.setTo(0.1);
		game.add.text(canvas_width - canvas_width / 3, canvas_height - canvas_height / 5, 'Continue', {font: "18px Courier New", fill: "#ffffff"});

	},
	nextLine: function() {
 		if (lineIndex === narrativeText.length)
    	{
	        //  We're finished
        	return;
    	}

    	//  Split the current line on spaces, so one word per array element
    	line = narrativeText[lineIndex].split(' ');

    	// 	Reset the word index to zero (the first word in the line)
    	wordIndex = 0;

    	//  Call the 'nextWord' function once for each word in the line (line.length)
    	game.time.events.repeat(wordDelay, line.length, this.nextWord, this);

    	//  Advance to the next line
    	lineIndex++;
	},
	nextWord: function() {
		//  Add the next word onto the text string, followed by a space
    	introText.text = introText.text.concat(line[wordIndex] + " ");

    	//  Advance the word index to the next word in the line
    	wordIndex++;

    	//  Last word?
    	if (wordIndex === line.length)
    	{
	        //  Add a carriage return
        	introText.text = introText.text.concat("\n");

        	//  Get the next line after the lineDelay amount of ms has elapsed
        	game.time.events.add(lineDelay, this.nextLine, this);
    	}

	},
	startIntro: function() {
		game.state.start('TitleScreen');
	}
}