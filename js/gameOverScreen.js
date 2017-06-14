

var gameOverScreen = function(game){};
gameOverScreen.prototype = {
	create:function(){
		enterkey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		enterkey.onDown.addOnce(this.restart,this);
		// if escape == true, good ending text
		if (escape == true) {
			if (score == 3) ending = bestEnding;
			else if (score == 2) ending = goodEnding;
			else if (score == 1) ending = okayEnding;
			else ending = badEnding;
		} else ending = deathEnding;

		lineIndex = 0;
		endingText = game.add.text(32, 32, '', {font: "18px Courier New", fill: "#ffffff"});
		this.nextLine();
		console.log(ending);
		console.log(endingText);
	},
	nextLine: function() {
 		if (lineIndex === ending.length)
    	{
	        //  We're finished
        	return;
    	}

    	//  Split the current line on spaces, so one word per array element
    	line = ending[lineIndex].split(' ');
	    
    	// 	Reset the word index to zero (the first word in the line)
    	wordIndex = 0;

    	//  Call the 'nextWord' function once for each word in the line (line.length)
    	game.time.events.repeat(wordDelay, line.length, this.nextWord, this);

    	//  Advance to the next line
    	lineIndex++;
	},
	nextWord: function() {
		//  Add the next word onto the text string, followed by a space
    	endingText.text = endingText.text.concat(line[wordIndex] + " ");

    	//  Advance the word index to the next word in the line
    	wordIndex++;

    	//  Last word?
    	if (wordIndex === line.length)
    	{
	        //  Add a carriage return
        	endingText.text = endingText.text.concat("\n");

        	//  Get the next line after the lineDelay amount of ms has elapsed
        	game.time.events.add(lineDelay, this.nextLine, this);
    	}

	},
	restart:function(){
		game.state.start('TitleScreen');
		BM3.stop()
		click2.play();
	}
}