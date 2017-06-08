

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
 
var player_turn;
var enemy_turn;

var marker; // rectangular marker on the field 
var controller; // the invisable object that controls the camera 
var player; // the selection diamond(*diamond is placeholder )
var ally; // ally unit 
var enemy;
var allies = new Array();
var enemies = new Array();
var hpbar;
var attackbutton;
var standbutton;

var turn_start = 1; // 1: indeicated the beginning of the turn 
					// 2: indicated the end of the turn 
					// 0: indicated middle of the turn 

var player_turn = true;
var mode = 0;
/*
* mode 0:	your turn, nothing selected(hovering over things)
* mode 1:	selected ally unit 
* mode 2:	enemy turn 
* mode 3:	player turn combat phase 
* mode 50: 	do nothing until other events change the mode 
*/
var menu = false;

var tile_data = init_tiledata(50,50);// contains the data of each tile 

var dark;

window.onload = function() 
{
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

		//turn art 
		game.load.image('player_turn', 'assets/img/playerturn.png');
		game.load.image('enemy_turn', 'assets/img/enemyturn.png');
		
		// title and ending preload
		game.load.image('TitleBG', 'assets/img/background1b.png');
		
		game.load.spritesheet('character', 'assets/img/vx_chara01_a.png', 32, 48, 12);
		
	},
	
	create: function() {
		// preload the 9patch box
		//game.cache.addNinePatch('blue_button02', 'blueSheet', 'blue_button02.png', 10, 10, 10, 20);
		// move to title screen
		this.game.state.start('TitleScreen');
	}
}// End preload 

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
}// End titleScreen 

var introScreen = function(game){};
introScreen.prototype = {
	create: function() {
		
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
}// End introScreen 

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
	init: function() 
	{
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

		//  This resizes the game world to match the layer dimensions
		// layer.resizeWorld();
	   var tileArr = layer2.getTiles(0, 0, 2400, 2400);
		for (var i = 0; i < tileArr.length; i++) {
			if (tileArr[i].index != -1) {
				tile_data[tileArr[i].x][tileArr[i].y].occupied = true;
				tile_data[tileArr[i].x][tileArr[i].y].occupant = 'wall';
				// console.log(tileArr[i].x + ', ' + tileArr[i].y);
			}
		}
	   
	   
		dark = new Darkness(game, 50, 50);
		game.add.existing(dark);
		dark.draw_darkmap();
		
		
		// init ally
		ally = new Ally(game, 'character', 0, 512, 384, 384, 1.5, 1);
		game.add.existing(ally);
		tile_data[layer1.getTileX(384)][layer1.getTileY(384)].occupied = true;
		tile_data[layer1.getTileX(384)][layer1.getTileY(384)].occupant = ally;
		hpbar = new HpBar(this.game, ally);
		game.add.existing(hpbar);
		ally.addChild(hpbar);
		ally.death_event = () => {
			game.state.start('GameOverScreen');
		};
		hpbar.redraw();
		allies.push(ally);
		
		enemy = new Enemy(game,'character', 9, 512, 912, 432, 1.5, 1);
		enemy.id = 0;
		game.add.existing(enemy);
		tile_data[layer1.getTileX(912)][layer1.getTileY(432)].occupied = true;
		tile_data[layer1.getTileX(912)][layer1.getTileY(432)].occupant = enemy;
		var hpbar_1 = new HpBar(this.game, enemy);
		game.add.existing(hpbar_1);
		enemy.addChild(hpbar_1);
		hpbar_1.redraw();
		enemies.push(enemy);
		
		var enemy2 = new Enemy(game,'character', 9, 512, 1152, 432, 1.5, 1);
		enemy2.id = 1;
		game.add.existing(enemy2);
		tile_data[layer1.getTileX(1152)][layer1.getTileY(432)].occupied = true;
		tile_data[layer1.getTileX(1152)][layer1.getTileY(432)].occupant = enemy2;
		var hpbar_1 = new HpBar(this.game, enemy2);
		game.add.existing(hpbar_1);
		enemy2.addChild(hpbar_1);
		hpbar_1.redraw();
		enemies.push(enemy2);
		
		
		// init player selection 
		player = new Player(game, 'diamond', 0, 512, 392, 392, 1); // 512 is the size of the image 
		player.alpha = 0.5;
		player.movement = () => {};
		game.add.existing(player);
		
		// init cursor marker 
		marker = game.add.graphics();
		marker.lineStyle(2, 0xffffff, 1);
		marker.drawRect(0, 0, 48, 48);
		 
		attackbutton = game.add.button(game.camera.x + 1140, game.camera.y + 360, 'attackbutton', () => {
			standbutton.visible = false;
			attackbutton.visible = false;
			mode = 3;
		}, this);
		attackbutton.visible = false;
		
		standbutton = game.add.button(game.camera.x + 1140, game.camera.y + 280, 'standbutton', () => {
			standbutton.visible = false;
			attackbutton.visible = false;
			mode = 2;
			turn_start = 1;
		}, this);
		standbutton.visible = false;
		 
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
		
		
		player_turn = game.add.sprite(1280, 250, 'player_turn');
		player_turn.alpha = 0;
		
		enemy_turn = game.add.sprite(1280, 250, 'enemy_turn');
		enemy_turn.alpha = 0;
		
		
		
	}, // End create 

	update: function()
	{// do all the things in the begnning of the update function 
		
		// update the following obectes so that it constantly follows the camera
		// UI should be done 
		attackbutton.position.x = game.camera.x + 1140;
		attackbutton.position.y = game.camera.y + 360;
		
		standbutton.position.x = game.camera.x + 1140;
		standbutton.position.y = game.camera.y + 280;
		
		player_turn.position.y = game.camera.y + 250;
		enemy_turn.position.y = game.camera.y + 250;
		
		
		
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
					if(turn_start == 1)
					{
						console.log('player_turn');
						darkmap_redraw();
						
						allies.forEach((obj) => {
							obj.update_bounds();
						}, this);
						enemies.forEach((obj) => {
							obj.update_bounds();
						}, this);
						//ally.update_bounds();
						//enemy.update_bounds();
						player_turn.alpha = 1;
						player_turn.position.x = game.camera.x + 1280;
						player_turn.position.y = game.camera.y + 250;
						var twn = game.add.tween(player_turn);
						twn.to(
							{
								x: game.camera.x + 400
							},
							200, 'Linear', false, 0
						);
						var twn_2 = game.add.tween(player_turn);
						twn_2.to(
							{
								x: game.camera.x - 500
							},
							200, 'Linear', false, 1000
						);
						twn_2.onComplete.add(() => {
							player_turn.alpha = 0;
							turn_start = 2;
						}, this);
						twn.chain(twn_2);
						twn.start();
						turn_start = 0;
					}
					else if(turn_start == 2)
					{
						if(tile.occupied)
						{// shows the movement area if it is an ally/enemy
							if(tile.occupant instanceof Object)
							{
									tile.occupant.bounds.alpha = 0.2;
							}
						}
						else
						{// otherwise hide movement area 
							allies.forEach((obj) => {
								obj.bounds.alpha = 0.0;
							}, this);
							enemies.forEach((obj) => {
								obj.bounds.alpha = 0.0;
							}, this);
						}
					}
				break;
				
				case 1: // hover event when ally is selected 
					
					
				break;
				
				case 2: // enemy turn
					if(turn_start == 1)
					{
						turn_start = 0;
						console.log('enemy_turn');
						darkmap_redraw();
						allies.forEach((obj) => {
							obj.update_bounds();
						}, this);
						enemies.forEach((obj) => {
							obj.update_bounds();
						}, this);
						//console.log('begin turn');
						enemy_turn.alpha = 1;
						enemy_turn.position.x = game.camera.x + 1280;
						enemy_turn.position.y = game.camera.y + 250;
						var twn = game.add.tween(enemy_turn);
						twn.to(
							{
								x: game.camera.x + 400
							},
							200, 'Linear', false, 0
						);
						var twn_2 = game.add.tween(enemy_turn);
						twn_2.to(
							{
								x: game.camera.x - 500
							},
							200, 'Linear', false, 1000
						);
						twn_2.onComplete.add(() => {
							//console.log("called");
							enemy_turn.alpha = 0;
							turn_start = 2;
						}, this);
						twn.chain(twn_2);
						twn.start();
						
						
					}
					else if(turn_start == 2)
					{
						//console.log("health " + ally.stats.health);
						//console.log("enemy_turn");
						turn_start = 50;
						if(enemies.length == 0)
						{
							mode = 0;
							turn_start = 1;
						}
						else
						{
							var twn;
							var first_twn;
							for(var i = 0; i < enemies.length; i++)
							{
								if(i == 0)
								{
									twn = game.add.tween(enemies[i]);
									twn.to({x: enemies[i].x, y: enemies[i].y}, 50, 'Linear', false, 0);
									first_twn = twn;
									twn = enemies[i].move(false, twn);
								}
								else if(i + 1 == enemies.length)
									twn = enemies[i].move(true, twn);
								else
								{
									twn = enemies[i].move(false, twn);
								}
							}
							console.log(first_twn);
							first_twn.start();
						}
						//console.log(ally.stats.health);
					}
				break;
				
				case 3: // combat_actions 
					if(turn_start == 1)
					{
						var graphics = game.add.graphics();
						graphics.beginFill(0xF88383, 0.5);
						graphics.lineStyle(2, 0x0000FF, 0.5);
						if(ally.tile_coord.y() < 49 && tile_data[ally.tile_coord.x()][ally.tile_coord.y() + 1].occupant != 'wall') graphics.drawRect(ally.x, ally.y+48, 48, 48);
						if(ally.tile_coord.y() > 0 && tile_data[ally.tile_coord.x()][ally.tile_coord.y() - 1].occupant != 'wall') graphics.drawRect(ally.x, ally.y-48, 48, 48);
						if(ally.tile_coord.x() > 0 && tile_data[ally.tile_coord.x() + 1][ally.tile_coord.y()].occupant != 'wall') graphics.drawRect(ally.x+48, ally.y, 48, 48);
						if(ally.tile_coord.x() < 49 && tile_data[ally.tile_coord.x() - 1][ally.tile_coord.y()].occupant != 'wall') graphics.drawRect(ally.x-48, ally.y, 48, 48);
						graphics.endFill();
						window.graphics = graphics;
						turn_start = 2;
					}
					else if(turn_start == 2)
					{
						
					}
				
				break;
				
			}
		}
		
	}// End update 
	
}// End playGame

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
					ally = tile.occupant;
					mode = 1;
					tile.occupant.bounds.alpha = 0.5;
				}
				else(tile.occupant instanceof Enemy)
				{
					tile.occupant.bounds.alpha = 0.5;
				}
			}
		break;
		
		case 1: //click when hovering 
			if(event.button == 2)
			{// right click 
				mode = 0;
				tile.occupant.bounds.alpha = 0.0;
			}
			else if(event.button == 0)
			{// left click  
				dark.clean_darkmap();
				var map_y = ally.stats.movement + (index_x - layer1.getTileX(ally.x));
				var map_x = ally.stats.movement + (index_y - layer1.getTileY(ally.y));
				
				var test_arr = layer2.getTiles(game.input.activePointer.worldX,game.input.activePointer.worldY, 1, 1);
				
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
								turn_start = 1;
								darkmap_redraw();
								ally.bounds.alpha = 0.0;	
								standbutton.visible = true;
								
								if(test_arr[0].index == -1)
								{	
									//game.paused = true;
									//here is where the menu should be called to pop up.
									
									attackbutton.visible = false;
									
									if(tile_data[layer1.getTileX(ally.x-48)][layer1.getTileY(ally.y)].occupant instanceof Enemy ||
										tile_data[layer1.getTileX(ally.x+48)][layer1.getTileY(ally.y)].occupant instanceof Enemy ||
										tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y-48)].occupant instanceof Enemy ||
										tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y+48)].occupant instanceof Enemy)
									{
										attackbutton.visible = true;
									}
									mode = 50;
									
								}
							}, this);
						}
						else
						{
							twn.onComplete.add(() => {
								//darkmap_redraw();
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
		
		
		case 3: // combat mode 
			var mouseindex_x = layer1.getTileX(game.input.activePointer.worldX);
			var mouseindex_y = layer1.getTileY(game.input.activePointer.worldY);
			var tile2 = tile_data[mouseindex_x][mouseindex_y];
			
			if(event.button == 0)
			{
				if(tile2 == tile_data[layer1.getTileX(ally.x-48)][layer1.getTileY(ally.y)]||
					tile2 == tile_data[layer1.getTileX(ally.x+48)][layer1.getTileY(ally.y)]||
					tile2 == tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y-48)]||
					tile2 == tile_data[layer1.getTileX(ally.x)][layer1.getTileY(ally.y+48)])
				{
					if(tile2.occupant instanceof Enemy)
					{
						//if enemy, attack
						tile2.occupant.stats.health = tile2.occupant.stats.health - (ally.stats.atk - tile2.occupant.stats.def);
						tile2.occupant.children[0].change();
						console.log(tile2.occupant);
						if(tile2.occupant != null && tile2.occupant.stats.health <=0)
						{
							for(var i = 0; i < enemies.length; i++)
							{
								if(tile.occupant === enemies[i])
								{
									console.log('removed');
									enemies.splice(i, 1);
								}
							}
							try
							{
								tile2.occupant.visible = false;
								tile2.occupant.move = () => {};
								tile2.occupant.update_bounds = () => {};
								tile2.occupant.update_darkness = () => {};
								tile_data[layer1.getTileX(tile2.occupant.x)][layer1.getTileY(tile2.occupant.y)].occupied = false;
								tile_data[layer1.getTileX(tile2.occupant.x)][layer1.getTileY(tile2.occupant.y)].occupant = null;
							}catch(e)
							{
								console.log("tile2_err");
							}
						}
						graphics.destroy();
						attackbutton.visible = false;
						standbutton.visible = false;
						mode = 2;
						turn_start = 1;
							
					}
				}
			}
			else if(event.button == 2)
			{
				
			}
		break;
	}// End switch 
	
	
	
}// End on_click

function darkmap_redraw()
{// redraws the darkness 
	dark.clean_darkmap();
	allies.forEach((obj) => {
		obj.update_darkness(dark);
	}, this);
	enemies.forEach((obj) => {
		obj.update_darkness(dark);
	}, this);
	dark.draw_darkmap();
}// End darkmap_redraw 


var gameOverScreen = function(game){};
gameOverScreen.prototype = {
	create: function()
	{
		console.log('u suk lel, git gud');
	}
}
