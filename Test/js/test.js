// global variables
var game;
var map;
var layer1;
var layer2;
var layer3;
var canvas_width = 1280;
var canvas_height = 720;
var bmpText;
var escape = false;
var chapter = 0; // chapter iterating
var score = 3; // survival choices affect this score, compromising choices decrease this score

// movement booleans
var move_up = false;
var move_down = false;
var move_left = false;
var move_right = false;

var marker; // rectangular marker on the field 
var controller; // the invisable object that controls the camera 
var player; // the selection diamond(*diamond is placeholder )
var ally; // ally unit 

var player_turn = true;
var mode = 0;

/*
* mode 0: your turn, nothing selected(hovering over things)
* mode 1: selected ally unit 
*/

var menu = false;
var tile_data = init_tiledata(50, 50);

var dark;

function init_tiledata(width, height) {
	// initialize tile_data
	var ret = new Array();
	for (var i = 0; i < width; i++) {
		var temp = new Array();
		for (var j = 0; j < height; j++) {
			temp.push
			({
				collide: false,
				occupied: false,
				name: "floor:",
				occupant: null
			});
		}
		ret.push(temp);
	}
	return ret;
} // end init_tiledata

// onload, create game states
window.onload = function() {
	game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, 'phaser');
	game.state.add('Boot', boot);
	game.state.add('Preload', preload);
	game.state.add('TitleScreen', titleScreen);
	game.state.add('TextScreen', textScreen);
	game.state.add('HowTo', howToPlay);
	game.state.add('PlayGame', playGame);
	game.state.add('GameOverScreen', gameOverScreen);
	game.state.start('Boot');
}

// boot state, preload for optional loading screen
var boot = function(game){};
boot.prototype = {
	preload: function() {
		// preload loading bar for preload state
	},
	create: function() {
		// move to preload state
		this.game.state.start('Preload');
	}
}

// preload state, display loading message and load assets
var preload = function(game) {};
preload.prototype = {
	preload: function() {
		game.load.tilemap('test', 'assets/Test1.json', null, Phaser.Tilemap.TILED_JSON);
	    game.load.image('Inside1', 'assets/tileset/Inside_A5.png');
		game.load.image('Inside2', 'assets/tileset/Inside_B.png');
		game.load.image('Inside3', 'assets/tileset/Inside_C.png');
		game.load.image('Outside1', 'assets/tileset/Outside_A2.png');
		game.load.image('Outside2', 'assets/tileset/Outside_B.png');
		game.load.image('Inside4', 'assets/tileset/SF_Inside_A4.png');
		game.load.image('Inside5', 'assets/tileset/SF_Inside_B.png');
		game.load.image('Inside6', 'assets/tileset/SF_Inside_C.png');
		game.load.image('Outside3', 'assets/tileset/SF_Outside_A5.png');
		game.load.image('Outside4', 'assets/tileset/SF_Outside_B.png');
		game.load.image('Outside5', 'assets/tileset/SF_Outside_C.png');

		// art preload
		game.load.image('diamond','assets/img/diamond.png');
		game.load.image('Square', 'assets/img/Square.jpg');

		// UI/text preload
		this.load.bitmapFont('MainFont', 'assets/font/font.png', 'assets/font/font.fnt');
		game.load.atlasXML('blueSheet', 'assets/UIpack/blueSheet.png', 'assets/UIpack/blueSheet.xml');
		// game.load.image('testButton', 'assets/img/platform.png');
		game.load.image('playButton', 'assets/img/blood.png');
		game.load.image('restartButton', 'assets/img/restart.png');
		game.load.image('continueButton', 'assets/img/continueButton.png');
		game.load.image('dayButton', 'assets/img/dayButton.png');
		game.load.image('nightButton', 'assets/img/nightButton.png');
		game.load.image('howToPlay', 'assets/img/howToPlay.png');

		// how to play preload



		// title and ending preload
		game.load.image('TitleBG', 'assets/img/TitleScreennoBlood.png');
	},
	create: function() {
		// move to title screen
		this.game.state.start('TitleScreen');
	}
}

var titleScreen = function(game){};
titleScreen.prototype = {
	create: function() {
		// reset game
		chapter = 0;
		score = 3;

		// splash background
		game.add.sprite(0, 0, 'TitleBG');
		var startButton = game.add.button(canvas_width - canvas_width / 3, canvas_height - canvas_height / 5, 'playButton', this.startIntro);
		startButton.anchor.set(0.5);
		startButton.scale.setTo(0.1);
		game.add.text(canvas_width - canvas_width / 3, canvas_height - canvas_height / 5, 'Play', {font: "18px Courier New", fill: "#ffffff"});

		var tutButton = game.add.button(canvas_width / 3, canvas_height - canvas_height /  4, 'howToPlay', this.startTut);
		tutButton.anchor.set(0.5);
	},
	startIntro: function(){
		game.state.start('TextScreen');
	},
	startTut: function(){
		game.state.start('HowTo');
	}
}

var chapter1Text = [
	"I overheard the barkeep's conversation with the captain of nightwatch. ",
	"He said something along the lines of . . .",
	". . .",
    "Barkeep: It's going to be a big night, ain't it?",
    "Captain: I sure hope so - 20 years and this is the thanks I get.",
	". . .",
    "It sounds like the guards will be throwing the chief a party. That probably means less guards on duty tonight.",
    "It's short notice, but I might be able to save supplies by moving forward now rather than wait for daybreak.",
    "Visibility might be low though . . .",
    "Should I try to make my way through during the day or at night?",
    ". . .",
];

var chapter2Text = [
	". . .",
	"Making it this far has been no easy task. We arrived just as the sun began to rise.",
	"Perhaps we should rest for the day, and continue onward at night. It may cost",
	"some time and valuable supplies, but . . .",
	"The rest might do us some good.",
	". . .",
	"On the other hand . . .",
	"If we push forward now, we can save our supplies and precious time",
	"for when it really counts . . .",
	"Should I push forward, or rest until night?",
	". . .",
];

var chapter3Text = [
	". . .",
	"It's been rough, but we are almost there. Through some impossible stroke of luck,",
	"I was able to locate where most of the local guard eat their dinner - a local kitchen",
	"open to Core employees . . .",
	"I have some medicine I was saving for emergencies, but if I pour it into their food,",
	"it will keep them too occupied during the night to keep an actual watch",
	". . .",
	"On the other hand, I can save time and supplies by going now. Some of the guards will",
	"be busy ordering their dinner, but there will still be a full duty roster. It's ",
	"a risk . . . but it might be one worth taking.",
	". . .",
	"Should I wait for night and poison the guards' food, or simply move on?",
	". . .",
];

var chapterText;

var line = [];
var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 75;
var lineDelay = 300;

var timeChoice = false; // default to day or night?

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

var narrativeText = [
	"More than 50 years ago a war erupted in the Core. Political turmoil stirred in our homes,", 
	"and we were forced to pick up arms. Once the smoke subsided, we were left with broken ties",
	" and spilt blood. The Core was split in two warring factions: South Core and North Core.",
	". . .",
	"Fast forward to present day in North Core, where my family suffers under the grip of oppression.",
	"We remain outsiders to the rest of the world - taught to believe that we are superior, but",
	"painfully aware of our reality. What glorious state such as ours would keep its own citizens on",
	"the constant brink of famine and punish us for original thought? I can't believe that a government",
	"such as ours shines as the pinnacle of society.",
	". . .",
	"I have resolved to escape. A way to leave the Core will come soon. My family can only afford to",
	"send me, provided I can reach the destination. Ahead lies a trial more difficult than I can imagine.",
	"I pray that I overcome it safely.",
	". . .",
];

var howToPlay = function(game){};
howToPlay.prototype = {
	create: function() {
		// // narrative introduction: what is core, who are you, why do you need to escape
		lineIndex = 0;
		introText = game.add.text(32, 32, '', {font: "18px Courier New", fill: "#ffffff"});
		this.nextLine();
		// // the decisions you will make
		// // the obstacles you will face
		// 	// to kill or to run
		var startButton = game.add.button(canvas_width - canvas_width / 3, canvas_height - canvas_height / 5, 'playButton', this.startIntro);
		startButton.anchor.set(0.5);
		startButton.scale.setTo(0.1);
		game.add.text(canvas_width - canvas_width / 3, canvas_height - canvas_height / 5, 'Play', {font: "18px Courier New", fill: "#ffffff"});

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
		game.state.start('TextScreen');
	}
}

var endTile;

var playGame = function(game){};
playGame.prototype = {
	init: function() {

	},
	create: function() {
		game.world.setBounds(0, 0, 2400, 2400);
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); } // negate right click menu 
		game.physics.startSystem(Phaser.Physics.ARCADE);

		map = game.add.tilemap('test');

		map.addTilesetImage('Outside1', 'Outside1');
		map.addTilesetImage('Inside1','Inside4');
		map.addTilesetImage('Inside2','Inside2');
		map.addTilesetImage('Inside3','Inside3');
		map.addTilesetImage('Dec1','Outside4');
		map.addTilesetImage('Outside2','Outside2');
		map.addTilesetImage('Dec2','Outside5');
		map.addTilesetImage('Road','Outside3');
		map.addTilesetImage('Inside5','Inside1');
		map.addTilesetImage('Inside7','Inside6');
		map.addTilesetImage('Inside8','Inside5');

    	//  Creates a layer from the World1 layer in the map data.
    	//  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    	layer1 = map.createLayer('Decoration 1');
		layer2 = map.createLayer('Decoration 2');
		layer3 = map.createLayer('Decoration 3');

		var test_array = layer2.getTiles(0, 48 * 5, 48 * 12, 1);
		for(var i = 0; i < test_array.length; i++)
			console.log(test_array[i].index == -1 ? false : true);

		// tile data for wall tiles
		var tileArr = layer2.getTiles(0, 0, 2400, 2400);
		for (var i = 0; i < tileArr.length; i++) {
			if (tileArr[i].index != -1) {
				tile_data[tileArr[i].x][tileArr[i].y].occupied = true;
				tile_data[tileArr[i].x][tileArr[i].y].occupant = 'wall';
				// console.log(tileArr[i].x + ', ' + tileArr[i].y);
			}
		}

		dark = new Darkness(game, 50, 50);
		if (timeChoice == true) {
			game.add.existing(dark);
			dark.draw_darkmap();
		}

		// init ally
		ally = new Ally(game, 'Square', 0, 512, 385, 385, 0.18);
		game.add.existing(ally);
		tile_data[layer1.getTileX(385)][layer1.getTileY(385)].occupied = true;
		tile_data[layer1.getTileX(385)][layer1.getTileY(385)].occupant = ally;
		
		// init player selection 
		player = new Player(game, 'diamond', 0, 512, 392, 392, 1); // 512 is the size of the image 
		player.alpha = 0.5;
		player.movement = () => {};
		game.add.existing(player);

		marker = game.add.graphics();
    	marker.lineStyle(2, 0xffffff, 1);
    	marker.drawRect(0, 0, 48, 48);

		// init controller 
		controller = new Player(game, 'diamond', 0, 512, canvas_width/2 - 22, canvas_height/2 - 10, 1); // 512 is the size of the image 
		controller.alpha = 0.0; 
		controller.movement = () => {
			if(move_up && controller.y > canvas_height / 2)
				controller.y -= 48;
			if(move_down && controller.y < 2400 - canvas_height / 2)
				controller.y += 48;
			if(move_left && controller.x > canvas_width / 2)
				controller.x -= 48;
			if(move_right && controller.x < 2400 - canvas_width / 2)
				controller.x += 48;
		};
		game.add.existing(controller); 
		game.camera.follow(controller);

		// add click event 
		game.input.onDown.add(on_click, this)
		console.log("your turn");


		endTile = tile_data[44][2]; // ladder in facility, behind green laser gate
		console.log(endTile);
	}, // end create
	update: function() {

		// find the tile index coordinate of the tile the cursor is hovering over 
		var index_x = layer1.getTileX(game.input.activePointer.worldX);
		var index_y = layer1.getTileY(game.input.activePointer.worldY);
	
	
	
		// moves the marker and player selection 
		marker.x = index_x * 48;
		marker.y = index_y * 48;
		player.x = index_x * 48 + 10;
		player.y = index_y * 48 + 10;

		try{
			var tile = tile_data[index_x][index_y];
		}catch(e){
			console.log("mouse not in canvas");
		}
		
		if(tile != null )
		{// check for hover events 
			switch(mode)
			{
				case 0: // hover event when nothing else is happening 
					if(tile.occupied)
					{// shows the movement area if it is an ally/enemy
						if(tile.occupant instanceof Object)
						{
							tile.occupant.bounds.alpha = 0.2;
						}
					}
					else
					{// otherwise hide movement area 
						ally.bounds.alpha = 0.0;
					}
				break;
				
				case 1: // hover event when ally is selected 
					
				break;
				
				case 2: // enemy turn
					console.log("enemy_turn");
					mode = 0;
					console.log("your turn");
				break;
			}
		}

		if (endTile.occupant == ally) {
			if (chapter == 2) {
				escape = true;
				game.state.start('GameOverScreen');
			} else {
				chapter++;
				game.state.start('TextScreen');
			}
		}

		// if player reaches certain tile, go to gameover state

	} // end update
}

var bestEnding = [ // 3/3 survival points and escaped
	"Today we leave behind the Core. We free ourselves of its oppression, and pray",
	"that tomorrow will bring opportunity. Even if we are no longer subject to",
	"North Core's power, we still have family back there.",
	". . .",
	"It's not over. I must fight to earn what I can so that someday we can be",
	"together again. So that we can be free.",
	". . .",
	"It's strange . . .",
	". . .",
	"The sunrise never looked so bright . . .",
];

var goodEnding = [ // 2/3 survival points and escaped
	"We left the Core behind, but it was more difficult than we ever anticipated. We bear",
	"scars - mental and physical - that will never heal. We've hurt others to get to where we are, and put",
	"our bodies and minds through an unforgettable hell.",
	". . .",
	"These scars remind us that it will never be over. Though we escaped, our families",
	"remain in the Core. We must continue to fight, so that someday we can all be together",
	"again. Even so . . .",
	". . . ",
	"On that day, will we finally be free?",
	". . .",
	"We watched as the sun rose above the horizon, and,",
	"for a moment,",
	". . .",
	"I felt at ease.",
];

var okayEnding = [ // 1/3 survival points and escaped
	"I could see the sunrise clearly over the horizon, and I felt my heart stop beating.",
	"We left the Core far behind us, but at a cost we may not ever recover. I held my partner's",
	"hand tightly, but could not feel her return my grip.",
	"I studied her face - weak and unresponsive to my tearful calls.",
	". . .",
	"She died soon after. I could do nothing but be a hand to hold. What was it that brought us to this point?",
	"Time? Hunger? Sickness?",
	". . .",
	"I don't know much time I spent by her side. When my eyes finally dried,",
	"I looked to the horizon.",
	". . .",
	"When did night fall?",
];

var badEnding = [ // 0/3 survival points and escaped
	". . .",
	"We barely escaped from North Core.",
	". . .",
	"Is it night? Day? I . . .",
	"I could barely open my eyes. It was dark out. I can't see a thing.",
	". . .",
	"I felt a light touch brush against my hand. I struggled to squeeze out a single word - the name of my partner.",
	"\"Ren?\"",
	". . .",
	"No response, but I felt the warmth of her hand in mine.",
	"I try to respond with a more firm grasp, but my fingers wouldn't respond.",
	". . .",
	"\"Ren?\", I repeated.",
	". . .",
	"Soon her warmth disappeared. Night, day, whatever time it was, it didn't matter. I couldn't see beyond the tears in my eyes.",
	"We made it this far, only to die? Here?",
	"It's not fair.",
	". . .",
	"\"I'm sorry . . .\"",
	"It didn't matter that we escaped. I just want another chance to be with my family.",
	". . .",
];

var deathEnding = [ // did not escape
	"I died.",
];

var ending = [];

var gameOverScreen = function(game){};
gameOverScreen.prototype = {
	create: function() {
		console.log('game over');
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
		// clickable buttons
		var startButton = game.add.button(canvas_width / 2, canvas_height - canvas_height / 5, 'restartButton', this.restart);
		startButton.anchor.set(0.5);
	},
	nextLine: function() {
		if(escape == true) {
	 		if (lineIndex === ending.length)
	    	{
		        //  We're finished
	        	return;
	    	}
    	}

    	//  Split the current line on spaces, so one word per array element
    	if (escape == true) {
	    	line = ending[lineIndex].split(' ');
	    }
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
	restart: function(){
		game.state.start('TitleScreen');
	}
}

function on_click(pointer, event)
{// when the user clicks
	
	var index_x = layer1.getTileX(game.input.activePointer.worldX);
	var index_y = layer1.getTileY(game.input.activePointer.worldY);
	var tile = tile_data[index_x][index_y];
	switch(mode)
	{
		case 0: // when nothing else is happening 
			if(tile.occupied && event.button == 0)
			{// select if ally is click 
				if(tile.occupant instanceof Ally)
				{
					mode = 1;
					ally.bounds.alpha = 0.5;
				}
			}
		break;
		
		case 1: 
			if(event.button == 2)
			{
				mode = 0;
				ally.bounds.alpha = 0.0;
			}
			else if(event.button == 0)
			{
				dark.clean_darkmap();
				var map_y = ally.stats.movement + (index_x - layer1.getTileX(ally.x));
				var map_x = ally.stats.movement + (index_y - layer1.getTileY(ally.y));
				console.log("mpx: " + map_x);
				console.log("mpy: " + map_y);
				if(ally.map_bool[map_x][map_y])
				{// if the area is moveable 
					tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y)].occupied = false;
					tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y)].occupant = null;
					ally.x = index_x * 48;
					ally.y = index_y * 48;
					tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y)].occupied = true;
					tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y)].occupant = ally;
					mode = 2;
					ally.update_bounds();
					ally.bounds.alpha = 0.0;
				}
			}
		break;
		
		case 2: break; // there should be nothing during mode 2
			
	}
	
}// End on_click

