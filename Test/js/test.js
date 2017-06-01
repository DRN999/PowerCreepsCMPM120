

var canvas_width = 1280; 
var canvas_height = 720; 
var game;
var bmpText;

var map; 

var layer1; 
var layer2; 
var layer3; 


// movement booleans 
var move_up = false; 
var move_down = false; 
var move_left = false; 
var move_right = false; 
 

var marker; // rectangular marker on the field 
var controller; // the invisable object that controls the camera 
var player; // the selection diamond(*diamond is placeholder )
var ally; // ally unit 
var hpbar;

var player_turn = true;
var mode = 0;
/*
* mode 0: your turn, nothing selected(hovering over things)
* mode 1: selected ally unit 
*/
var menu = false;

var tile_data = init_tiledata(50,50);// contains the data of each tile 

var dark;

window.onload = function() {
	game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, 'phaser');
	game.state.add('Boot', boot);
	game.state.add('Preload', preload);
	game.state.add('TitleScreen', titleScreen);
	game.state.add('IntroScreen', introScreen);
	game.state.add('PlayGame', playGame);
	game.state.add('GameOverScreen', gameOverScreen);
	game.state.start("Boot");
}

// boot state, optional loading screen
var boot = function(game){};
boot.prototype = {
	preload: function() {
		// preload the loading bar for preload state
	},
	create: function() {
		// move to preload state
		this.game.state.start('Preload');
	}
}

var preload = function(game) {};
preload.prototype = {
	preload: function() {
		// tilemap preload
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


		// title and ending preload
		game.load.image('TitleBG', 'assets/img/background1b.png');
	},
	create: function() {
		// preload the 9patch box
		//game.cache.addNinePatch('blue_button02', 'blueSheet', 'blue_button02.png', 10, 10, 10, 20);
		// move to title screen
		this.game.state.start('TitleScreen');
	}
}
var preload = function(game) {};
preload.prototype = {
	preload: function() 
	{
		game.load.tilemap('test', 'assets/Test1.json', null, Phaser.Tilemap.TILED_JSON);

		//  Next we load the tileset. This is just an image, loaded in via the normal way we load images:

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
		game.load.image('diamond','assets/img/diamond.png');
		game.load.image('Square', 'assets/img/Square.jpg');
		game.load.image('placeholder', 'assets/img/placeholder.png');
		game.load.image('standbutton', 'assets/img/standbutton.png');
		game.load.image('attackbutton', 'assets/img/attackbutton.png');
		this.load.bitmapFont('MainFont', 'assets/font/font.png', 'assets/font/font.fnt');
		game.load.atlasXML('blueSheet', 'assets/UIpack/blueSheet.png', 'assets/UIpack/blueSheet.xml');
		game.load.image('testButton', 'assets/img/platform.png');


		// title and ending preload
		game.load.image('TitleBG', 'assets/img/background1b.png');
	},
	
	create: function() {
		// preload the 9patch box
		//game.cache.addNinePatch('blue_button02', 'blueSheet', 'blue_button02.png', 10, 10, 10, 20);
		// move to title screen
		this.game.state.start('TitleScreen');
	}
}
var titleScreen = function(game){};
titleScreen.prototype = {
	create: function() {
		// add splash background
		game.add.sprite(0, 0, 'TitleBG');
		// title
		titleText = game.add.bitmapText(canvas_width / 2, 100, 'MainFont', 'Escaping Core', 150);
		titleText.anchor.set(0.5);
		// clickable buttons
		var startButton = game.add.button(canvas_width / 2,  canvas_height / 2, 'testButton', this.startIntro);
		startButton.anchor.set(0.5);
		// game starting function
	},
	startIntro: function(){
		game.state.start('IntroScreen');
	}
}

var introScreen = function(game){};
introScreen.prototype = {
	create: function() {
		/*
		// dialogue box test
		var dialogueBox = new Phaser.NinePatchImage(game, canvas_width / 2, 100, 'blue_button02');
		dialogueBox.anchor.set(0.5);
		dialogueBox.targetWidth = 900;
		dialogueBox.targetHeight = 100;
		dialogueBox.UpdateImageSizes();
		*/
		
		// narrative introduction
		narrativeText = game.add.bitmapText(canvas_width / 2, 100, 'MainFont', 'This is a story all about how my life got flipped - turned upside down\n' + 'Now I\'d like to take a minute, just sit right there\n' + 'I\'ll tell you how I became prince of a town called Bel-Air', 30);
		narrativeText.anchor.set(0.5);

		// possibly features choice flags that are passed to the game state
		var choiceButton = game.add.button(canvas_width / 2, canvas_height - canvas_height / 4, 'testButton', this.startGame);
		choiceButton.anchor.set(0.5);
	},
	startGame: function() {
		// pass flags as parameters from intro to game based on player choice
		game.state.start('PlayGame');
	}
}

function init_tiledata(width, height) 
{// inititalize tile_data 
	var ret = new Array();
	for(var i = 0; i < width; i++)
	{
		var temp = new Array();
		for(var j = 0; j < height; j++)
		{
			temp.push
			({
				collide: false,
				occupied: false,
				name: "floor",
				occupant: null
				
			});
		}
		ret.push(temp);
	}
	return ret;
}// End init_tiledata 

var playGame = function(game){};
playGame.prototype = {
	init: function() {
		// takes parameters passed from introScreen, determines things in level?
	},

	create: function() 
	{ // 
		
		game.world.setBounds(0, 0, 2400, 2400);
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); } // negate right click menu 
		game.physics.startSystem(Phaser.Physics.ARCADE);
	   // game.stage.backgroundColor = '#787878';
		map = game.add.tilemap('test'); 
		
		//  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
		//  The second parameter maps this name to the Phaser.Cache key 'tiles'
		map.addTilesetImage('Outside1','Outside1');
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
		//  This resizes the game world to match the layer dimensions
		// layer.resizeWorld();
	   
	   
		dark = new Darkness(game, 50, 50);
		game.add.existing(dark);
		dark.draw_darkmap();
		
		// init ally
		ally = new Ally(game, 'Square', 0, 512, 385, 385, 0.18);
		game.add.existing(ally);
		tile_data[layer1.getTileX(385)][layer1.getTileY(385)].occupied = true;
		tile_data[layer1.getTileX(385)][layer1.getTileY(385)].occupant = ally;
		
		enemy = new Enemy(game,'Square',0, 512, 913, 433, 0.18);
		game.add.existing(enemy);
		tile_data[layer1.getTileX(913)][layer1.getTileY(433)].occupied = true;
		tile_data[layer1.getTileX(913)][layer1.getTileY(433)].occupant = enemy;
		
		
		// init player selection 
		player = new Player(game, 'diamond', 0, 512, 392, 392, 1); // 512 is the size of the image 
		player.alpha = 0.5;
		player.movement = () => {};
		game.add.existing(player);
		
		// init cursor marker 
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
		hpbar = new HpBar(this.game, ally);
	},

	update: function()
	{
		if(enemy.body != null && enemy.stats.health<=0){
			tile_data[layer1.getTileX(enemy.x)][layer1.getTileY(enemy.y)].occupied = false;
			tile_data[layer1.getTileX(enemy.x)][layer1.getTileY(enemy.y)].occupant = null;
			enemy.move = () => {};
			enemy.body = null;
			enemy.destroy();
		}
		
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
						enemy.bounds.alpha = 0.0;
					}
				break;
				
				case 1: // hover event when ally is selected 
					
					
				break;
				
				case 2: // enemy turn
					console.log("health " + ally.stats.health);
					console.log("enemy_turn");
					enemy.move(ally.x,ally.y);
					
					//console.log(ally.stats.health);
					
				break;
			}
		}
		
	}
}

function on_click(pointer, event)
{// when the user clicks
	
	var index_x = layer1.getTileX(game.input.activePointer.worldX);
	var index_y = layer1.getTileY(game.input.activePointer.worldY);
	var tile = tile_data[index_x][index_y];
	switch(mode)
	{// mode selection onclick 
	
		case 0: // when nothing else is happening 
			if(tile.occupied && event.button == 0)
			{// select if ally is click 
				if(tile.occupant instanceof Ally)
				{
					mode = 1;
					ally.bounds.alpha = 0.5;
				}
				else(tile.occupant instanceof Enemy)
				{
					ally.bounds.alpha = 0.5;
				}
			}
		break;
		
		case 1: //click when hovering 
			if(event.button == 2)
			{// right click 
				mode = 0;
				ally.bounds.alpha = 0.0;
			}
			else if(event.button == 0)
			{// left click  
				dark.clean_darkmap();
				var map_y = ally.stats.movement + (index_x - layer1.getTileX(ally.x));
				var map_x = ally.stats.movement + (index_y - layer1.getTileY(ally.y));
				console.log("mpx: " + map_x);
				console.log("mpy: " + map_y);
				var test_arr = layer2.getTiles(game.input.activePointer.worldX,game.input.activePointer.worldY, 1, 1);
				console.log(test_arr);
				if(ally.map_bool[map_x][map_y])
				{// if the area is moveable 
					tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y)].occupied = false;
					tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y)].occupant = null;
					
					var arr = new Array();
					ally.dijikstra_tree_search(map_y, map_x, ally.dijikstra_tree, arr);
					var prev_twn;
					var first_twn;
					for(var i = 0; i < arr.length; i++)
					{// create chained tweens
						var twn = game.add.tween(ally);
						if(i + 1 == arr.length)
						{// do complete on last tween 
							twn.onComplete.add(() => {
								tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y)].occupied = true;
								tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y)].occupant = ally;
								mode = 2;
								ally.update_bounds();
								ally.bounds.alpha = 0.0;	
								
								if(test_arr[0].index == -1)
								{
									console.log("this is not a wall lel");
									
									game.paused = true;
									console.log('moved'); //here is where the menu should be called to pop up.
						
									if(tile_data[layer1.getTileX(ally.x-48)][layer1.getTileY(ally.y)].occupant instanceof Enemy ||
										tile_data[layer1.getTileX(ally.x+48)][layer1.getTileY(ally.y)].occupant instanceof Enemy ||
										tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y-48)].occupant instanceof Enemy ||
										tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y+48)].occupant instanceof Enemy)
									{
										attackbutton = game.add.button(game.camera.x + 1140, game.camera.y + 360, 'attackbutton');
										attackbutton.onInputUp.add(upAttack, this);
										attackbutton.onInputUp.add(overAttack, this);
										mode = 2;
									}
									mode = 2;
									console.log("hello2");
									
									standbutton= game.add.button(game.camera.x + 1140, game.camera.y + 280, 'standbutton');
									standbutton.onInputUp.add(upStand, this);
									standbutton.onInputUp.add(overStand, this);
									maxhpbar.x = ally.x;
									maxhpbar.y = ally.y;
									currentbar.x = ally.x;
									currentbar.y = ally.y;
									
								}
							}, this);
						}
						twn.to(
						{// tween to move one block 
							x: (ally.tile_coord.x() + (arr[i].x - ally.stats.movement)) * 48, 
							y: (ally.tile_coord.y() + (arr[i].y - ally.stats.movement)) * 48
						}, 50, 'Linear', false, 0);
						if(i != 0)
							prev_twn.chain(twn);
						else if (i == 0)
							first_twn = twn;
						prev_twn = twn;	
					}
					first_twn.start();
					mode = 50;
					
					//ally.x = index_x * 48;
					//ally.y = index_y * 48;
					
				}
			}
		break;
		
		case 2: break; // there should be nothing during mode 2
			
	}
	
}// End on_click

var gameOverScreen = function(game){};
gameOverScreen.prototype = {

}

//button functions, up* functions are when the click is released, perform attack within this function.
function upAttack() {
	//draw(ally);
	game.paused = false;
    console.log('button up', arguments);
	// attack should happen here
	console.log('attack button pressed')
	
	counter = 0;
	clickcheck(); 
	
	standbutton.destroy();
	attackbutton.destroy();
}


function overAttack() {
    console.log('button over');
}



function upStand() {
    console.log('button up', arguments);
	//stand happens here
	
	
	game.paused = false;
	//placeholder.destroy();
	standbutton.destroy();
	attackbutton.destroy();
}
function overStand() {
    console.log('button over');
}

//need some detection to provide attack button when enemy is in range only

function unpause(event)
{
	if(game.paused){
		
		var key_esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC); //possibly make right click undo if we have time
		key_esc.onDown.add(function(){
		
			// Remove the menu and the label
			
			//choiseLabel.destroy();
			
			// Unpause the game
			
		});
	}
}

function draw(ally)
{
	counter = 0;
	console.log('in draw ally');
	//squareup = new Phaser.Rectangle(ally.x,ally.y-32,ally.x+32,ally.y);
	//squarebot = new Phaser.Rectangle(ally.x,ally.y+32,ally.x+32,ally.y+32);
	//squareleft = new Phaser.Rectangle(ally.x-32,ally.y,ally.x,ally.y+32);
	//squareright = new Phaser.Rectangle(ally.x+32,ally.y,ally.x+32,ally.y+32);
	
	//game.debug.geom(squareup,'#EE6F6F');
	//game.debug.geom(squarebot,'#EE6F6F');
	//game.debug.geom(squareleft,'#EE6F6F');
	//game.debug.geom(squareright,'#EE6F6F');
	//really dumb way to draw four squares around characters, melee range.
	
	//clickcheck(); 
}

var counter = 0;
function clickcheck()
{
	game.paused = true;
	console.log("enemy health" + enemy.stats.health);
	console.log('in click');

	//ally.map[map_x-1][map_y]
	//ally.map[map_x+1][map_y]
	//ally.map[map_x][map_y-1]
	//ally.map[map_x][map_y+1]
	game.input.onDown.add(click2, this)

}

function click2()
{	

	var index_x = layer1.getTileX(game.input.activePointer.worldX);
	var index_y = layer1.getTileY(game.input.activePointer.worldY);
	var tile = tile_data[index_x][index_y];
	var map_y = ally.stats.movement + (index_x - layer1.getTileX(ally.x));
	var map_x = ally.stats.movement + (index_y - layer1.getTileY(ally.y));
	if(tile == ally.map[map_x-1][map_y] || tile ==	ally.map[map_x+1][map_y] ||ally.map[map_x][map_y-1] || ally.map[map_x][map_y+1]){
		console.log("hello123");
			if(tile.occupant == enemy && counter == 0){
				
				//if enemy, attack
				console.log(counter);
				counter++;
				enemy.stats.health = enemy.stats.health - (ally.stats.atk + enemy.stats.def);
				
	
			}
	}
	else{console.log("not in range");
	mode = 0;
	}
	
	game.paused = false;
}

