// global variables
var game;
var map;
var layer1;
var layer2;
var layer3;
var canvas_width = 1280;
var canvas_height = 720;
var bmpText;

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
	game.state.add('IntroScreen', introScreen);
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
		game.load.image('testButton', 'assets/img/platform.png');
		game.load.image('dayButton', 'assets/img/dayButton.png');
		game.load.image('nightButton', 'assets/img/nightButton.png');


		// title and ending preload
		game.load.image('TitleBG', 'assets/img/background1b.png');
	},
	create: function() {
		// preload the 9patch box
		game.cache.addNinePatch('blue_button02', 'blueSheet', 'blue_button02.png', 10, 10, 10, 20);
		// move to title screen
		this.game.state.start('TitleScreen');
	}
}

var titleScreen = function(game){};
titleScreen.prototype = {
	create: function() {
		// splash background
		game.add.sprite(0, 0, 'TitleBG');
		// title
		titleText = game.add.bitmapText(canvas_width / 2, 100, 'MainFont', 'Escaping Core', 120);
		titleText.anchor.set(0.5);
		// clickable buttons
		var startButton = game.add.button(canvas_width / 2, canvas_height / 2, 'testButton', this.startIntro);
		startButton.anchor.set(0.5);
	},
	startIntro: function(){
		game.state.start('IntroScreen');
	}
}


var narrativeText = [
	"I overheard the barkeep's conversation with the captain of nightwatch. ",
	"He said something along the lines of . . .",
	". . .",
    "Barkeep: It's going to be a big night, ain't it?",
    "Captain: I sure hope so; 20 years and this is the thanks I get.",
	". . .",
    "It sounds like the guards will be throwing the chief a party. That probably means less guards on duty tonight.",
    "Should I try to make my way through during the day or at night?",
    "Visibility might be low though . . .",
];

var line = [];
var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 75;
var lineDelay = 300;

var choice = false; // default to day or night?

var introScreen = function(game){};
introScreen.prototype = {
	create: function() {
		// dialogue box test
		// var dialogueBox = new Phaser.NinePatchImage(game, canvas_width / 2, 100, 'blue_button02');
		// dialogueBox.anchor.set(0.5);
		// dialogueBox.targetWidth = 900;
		// dialogueBox.targetHeight = 100;
		// dialogueBox.UpdateImageSizes();

		// narrative introduction
		text = game.add.text(32, 32, '', {font: "18px Arial", fill: "#ffffff"});
		this.nextLine();

		var nightButton = game.add.button(25, 400, 'nightButton', this.startGameNight);
		var dayButton = game.add.button(canvas_width / 2 + 25, 400, 'dayButton', this.startGameDay);
		
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
    	text.text = text.text.concat(line[wordIndex] + " ");

    	//  Advance the word index to the next word in the line
    	wordIndex++;

    	//  Last word?
    	if (wordIndex === line.length)
    	{
	        //  Add a carriage return
        	text.text = text.text.concat("\n");

        	//  Get the next line after the lineDelay amount of ms has elapsed
        	game.time.events.add(lineDelay, this.nextLine, this);
    	}

	},
	startGameNight: function() {
		choice = true;
		game.state.start('PlayGame');
	},
	startGameDay: function() {
		game.state.start('PlayGame');
	}
}

var howToPlay = function(game){};
howToPlay.prototype = {
	create: function() {
		console.log('how to play');
	}
}

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
			}
		}

		dark = new Darkness(game, 50, 50);
		if (choice == true) {
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

	} // end update
}

var gameOverScreen = function(game){};
gameOverScreen.prototype = {
	create: function() {
		console.log('game over');
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

