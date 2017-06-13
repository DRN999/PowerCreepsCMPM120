var textScreen = function(game){};
textScreen.prototype = {
	create: function() {

		// reset timeChoice
		timeChoice = false;
		
		// determine which text to display
		if (chapter == 0) chapterText = chapter1Text;
		else if (chapter == 1) chapterText = chapter2Text;
		else chapterText = chapter3Text;

		// narrative introduction
		lineIndex = 0;
		chText = game.add.text(32, 32, '', {font: "18px Courier New", fill: "#ffffff"});
		this.nextLine();

		var nightButton = game.add.button(25, canvas_height - 100, 'nightButton', this.playNight);
		var dayButton = game.add.button(canvas_width / 2 + 25, canvas_height - 100, 'dayButton', this.playDay);
		
	},
	nextLine: function() {
 		if (lineIndex === chapterText.length)
    	{
	        //  We're finished
        	return;
    	}

    	//  Split the current line on spaces, so one word per array element
    	line = chapterText[lineIndex].split(' ');

    	// 	Reset the word index to zero (the first word in the line)
    	wordIndex = 0;

    	//  Call the 'nextWord' function once for each word in the line (line.length)
    	game.time.events.repeat(wordDelay, line.length, this.nextWord, this);

    	//  Advance to the next line
    	lineIndex++;
	},
	nextWord: function() {
		//  Add the next word onto the text string, followed by a space
    	chText.text = chText.text.concat(line[wordIndex] + " ");

    	//  Advance the word index to the next word in the line
    	wordIndex++;

    	//  Last word?
    	if (wordIndex === line.length)
    	{
	        //  Add a carriage return
        	chText.text = chText.text.concat("\n");

        	//  Get the next line after the lineDelay amount of ms has elapsed
        	game.time.events.add(lineDelay, this.nextLine, this);
    	}

	},
	playNight: function() {
		if (chapter == 2) score --;
		timeChoice = true;
		game.state.start('PlayGame');

	},
	playDay: function() {
		if (chapter == 0 || chapter == 1) score--;
		game.state.start('PlayGame');
	}

}