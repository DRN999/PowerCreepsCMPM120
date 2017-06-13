
var playGame = function(game){};
playGame.prototype = {
	
	player_turn: 0,
	enemy_turn: 0,

	marker: 0, // rectangular marker on the field 
	controller: 0, // the invisable object that controls the camera 
	player: 0, // the selection diamond(*diamond is placeholder )
	ally: 0, // ally unit 
	allies: new Array(),
	enemies: new Array(),
	attackbutton: 0,
	standbutton: 0,

	turn_start: 1,		// 1: indeicated the beginning of the turn 
						// 2: indicated the end of the turn 
						// 0: indicated middle of the turn 
	mode: 0,
	/*
	* mode 0:	your turn, nothing selected(hovering over things)
	* mode 1:	selected ally unit 
	* mode 2:	enemy turn 
	* mode 3:	player turn combat phase 
	* mode 50: 	do nothing until other events change the mode 
	*/
	
	map: 0, 

	layer1: 0,
	layer2: 0,
	layer3: 0,

	tile_data: init_tiledata(50,50),// contains the data of each tile 
		
	dark: 0,
	
	init: function() 
	{
		// takes parameters passed from introScreen, determines things in level?
	},

	create: function() 
	{ // 
		BM1.stop();
		BM3.loop = true;
		BM3.volume = 1;
		BM3.play();
		game.world.setBounds(0, 0, 2400, 2400);
		game.canvas.oncontextmenu = function (e) { e.preventDefault(); } // negate right click menu 
		game.physics.startSystem(Phaser.Physics.ARCADE);
	   // game.stage.backgroundColor = '#787878';
		this.map = game.add.tilemap('test'); 
		//  The first parameter is the tileset name, as specified in the Tiled this.map editor (and in the tilemap json file)
		//  The second parameter maps this name to the Phaser.Cache key 'tiles'
		this.map.addTilesetImage('Outside1','Outside1');
		this.map.addTilesetImage('Inside1','Inside4');
		this.map.addTilesetImage('Inside2','Inside2');
		this.map.addTilesetImage('Inside3','Inside3');
		this.map.addTilesetImage('Dec1','Outside4');
		this.map.addTilesetImage('Outside2','Outside2');
		this.map.addTilesetImage('Dec2','Outside5');
		this.map.addTilesetImage('Road','Outside3');
		this.map.addTilesetImage('Inside5','Inside1');
		this.map.addTilesetImage('Inside7','Inside6');
		this.map.addTilesetImage('Inside8','Inside5');

		//  Creates a layer from the World1 layer in the map data.
		//  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
		this.layer1 = this.map.createLayer('Decoration 1');
		this.layer2 = this.map.createLayer('Decoration 2');
		this.layer3 = this.map.createLayer('Decoration 3');

		//  This resizes the game world to match the layer dimensions
		// layer.resizeWorld();
	   var tileArr = this.layer2.getTiles(0, 0, 2400, 2400);
		for (var i = 0; i < tileArr.length; i++) {
			if (tileArr[i].index != -1) {
				this.tile_data[tileArr[i].x][tileArr[i].y].occupied = true;
				this.tile_data[tileArr[i].x][tileArr[i].y].occupant = 'wall';
				// console.log(tileArr[i].x + ', ' + tileArr[i].y);
			}
		}
	   
	   
		this.dark = new Darkness(game, 50, 50);
		if(timeChoice)
		{
			game.add.existing(this.dark);
			this.dark.draw_darkmap();
		}
		
		// init ally
		this.ally = new Ally(game, 'character', 0, 512, 384, 384, 1.5, 1, this.layer2, this.tile_data);
		game.add.existing(this.ally);
		this.tile_data[this.layer1.getTileX(384)][this.layer1.getTileY(384)].occupied = true;
		this.tile_data[this.layer1.getTileX(384)][this.layer1.getTileY(384)].occupant = this.ally;
		var hpbar = new HpBar(this.game, this.ally);
		game.add.existing(hpbar);
		this.ally.addChild(hpbar);
		this.ally.death_event = () => {
			game.state.start('GameOverScreen');
		};
		hpbar.redraw();
		this.allies.push(this.ally);
		
		enemy = new Enemy(game,'character', 9, 512, 912, 432, 1.5, 1, this.layer2, this.tile_data, this.allies, this);
		enemy.id = 0;
		game.add.existing(enemy);
		this.tile_data[this.layer1.getTileX(912)][this.layer1.getTileY(432)].occupied = true;
		this.tile_data[this.layer1.getTileX(912)][this.layer1.getTileY(432)].occupant = enemy;
		var hpbar_1 = new HpBar(this.game, enemy);
		game.add.existing(hpbar_1);
		enemy.addChild(hpbar_1);
		hpbar_1.redraw();
		this.enemies.push(enemy);
		
		var enemy2 = new Enemy(game,'character', 9, 512, 1152, 432, 1.5, 1, this.layer2, this.tile_data, this.allies, this);
		enemy2.id = 1;
		game.add.existing(enemy2);
		this.tile_data[this.layer1.getTileX(1152)][this.layer1.getTileY(432)].occupied = true;
		this.tile_data[this.layer1.getTileX(1152)][this.layer1.getTileY(432)].occupant = enemy2;
		var hpbar_1 = new HpBar(this.game, enemy2);
		game.add.existing(hpbar_1);
		enemy2.addChild(hpbar_1);
		hpbar_1.redraw();
		this.enemies.push(enemy2);
		
		var enemy3 = new Enemy(game,'character', 9, 512, 1200, 432, 1.5, 1, this.layer2, this.tile_data, this.allies, this);
		enemy3.id = 2;
		game.add.existing(enemy3);
		this.tile_data[this.layer1.getTileX(1200)][this.layer1.getTileY(432)].occupied = true;
		this.tile_data[this.layer1.getTileX(1200)][this.layer1.getTileY(432)].occupant = enemy3;
		var hpbar_2 = new HpBar(this.game, enemy3);
		game.add.existing(hpbar_2);
		enemy3.addChild(hpbar_2);
		hpbar_2.redraw();
		this.enemies.push(enemy3);
		
		var enemy4 = new Enemy(game,'character', 9, 512, 1248, 432, 1.5, 1, this.layer2, this.tile_data, this.allies, this);
		enemy4.id = 3;
		game.add.existing(enemy4);
		this.tile_data[this.layer1.getTileX(1248)][this.layer1.getTileY(432)].occupied = true;
		this.tile_data[this.layer1.getTileX(1248)][this.layer1.getTileY(432)].occupant = enemy4;
		var hpbar_2 = new HpBar(this.game, enemy4);
		game.add.existing(hpbar_2);
		enemy4.addChild(hpbar_2);
		hpbar_2.redraw();
		this.enemies.push(enemy4);
		
		
		// init player selection 
		this.player = new Player(game, 'diamond', 0, 512, 392, 392, 1); // 512 is the size of the image 
		this.player.alpha = 0.5;
		this.player.movement = () => {};
		game.add.existing(this.player);
		
		// init cursor marker 
		this.marker = game.add.graphics();
		this.marker.lineStyle(2, 0xffffff, 1);
		this.marker.drawRect(0, 0, 48, 48);
		 
		this.attackbutton = game.add.button(game.camera.x + 1140, game.camera.y + 360, 'attackbutton', () => {
			this.standbutton.visible = false;
			this.attackbutton.visible = false;
			click2.play();
			this.mode = 3;
		}, this);
		this.attackbutton.visible = false;
		
		this.standbutton = game.add.button(game.camera.x + 1140, game.camera.y + 280, 'standbutton', () => {
			this.standbutton.visible = false;
			this.attackbutton.visible = false;
			click2.play();
			this.mode = 2;
			this.turn_start = 1;
		}, this);
		this.standbutton.visible = false;
		 
		 // init controller 
		this.controller = new Player(game, 'diamond', 0, 512, canvas_width/2 - 22, canvas_height/2 - 10, 1); // 512 is the size of the image 
		this.controller.alpha = 0.0; 
		game.add.existing(this.controller); 
		game.camera.follow(this.controller);
		
		// add click event 
		game.input.onDown.add(this.on_click, this);
		console.log("your turn");
		
		
		this.player_turn = game.add.sprite(1280, 250, 'player_turn');
		this.player_turn.alpha = 0;
		
		this.enemy_turn = game.add.sprite(1280, 250, 'enemy_turn');
		this.enemy_turn.alpha = 0;
		
		
		
	}, // End create 

	update: function()
	{// do all the things in the begnning of the update function 
		
		// update the following obectes so that it constantly follows the camera
		// UI should be done 
		this.attackbutton.position.x = game.camera.x + 1140;
		this.attackbutton.position.y = game.camera.y + 360;
		
		this.standbutton.position.x = game.camera.x + 1140;
		this.standbutton.position.y = game.camera.y + 280;
		
		this.player_turn.position.y = game.camera.y + 250;
		this.enemy_turn.position.y = game.camera.y + 250;
		
		
		
		// find the tile index coordinate of the tile the cursor is hovering over 
		var index_x = this.layer1.getTileX(game.input.activePointer.worldX);
		var index_y = this.layer1.getTileY(game.input.activePointer.worldY);
		
		// moves the this.marker and player selection 
		this.marker.x = index_x * 48;
		this.marker.y = index_y * 48;
		this.player.x = index_x * 48 + 10;
		this.player.y = index_y * 48 + 10;
		
		try{
			var tile = this.tile_data[index_x][index_y];
		}catch(e){
			console.log("mouse not in canvas");
		}
		
		if(tile != null )
		{// check for hover events 
			switch(this.mode)
			{
				case 0: // hover event when nothing else is happening 
					if(this.turn_start == 1)
					{
						console.log('player_turn');
						this.darkmap_redraw();
						
						this.allies.forEach((obj) => {
							obj.update_bounds();
						}, this);
						this.enemies.forEach((obj) => {
							obj.update_bounds();
						}, this);
						
						this.player_turn.alpha = 1;
						this.player_turn.position.x = game.camera.x + 1280;
						this.player_turn.position.y = game.camera.y + 250;
						var twn = game.add.tween(this.player_turn);
						twn.to(
							{
								x: game.camera.x + 400
							},
							200, 'Linear', false, 0
						);
						var twn_2 = game.add.tween(this.player_turn);
						twn_2.to(
							{
								x: game.camera.x - 500
							},
							200, 'Linear', false, 1000
						);
						twn_2.onComplete.add(() => {
							this.player_turn.alpha = 0;
							this.turn_start = 2;
						}, this);
						twn.chain(twn_2);
						twn.start();
						this.turn_start = 0;
					}
					else if(this.turn_start == 2)
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
							this.allies.forEach((obj) => {
								obj.bounds.alpha = 0.0;
							}, this);
							this.enemies.forEach((obj) => {
								obj.bounds.alpha = 0.0;
							}, this);
						}
					}
				break;
				
				case 1: // hover event when ally is selected 
					
					
				break;
				
				case 2: // enemy turn
					if(this.turn_start == 1)
					{
						this.turn_start = 0;
						console.log('enemy_turn');
						this.darkmap_redraw();
						this.allies.forEach((obj) => {
							obj.update_bounds();
						}, this);
						this.enemies.forEach((obj) => {
							obj.update_bounds();
						}, this);
						
						this.enemy_turn.alpha = 1;
						this.enemy_turn.position.x = game.camera.x + 1280;
						this.enemy_turn.position.y = game.camera.y + 250;
						var twn = game.add.tween(this.enemy_turn);
						twn.to(
							{
								x: game.camera.x + 400
							},
							200, 'Linear', false, 0
						);
						var twn_2 = game.add.tween(this.enemy_turn);
						twn_2.to(
							{
								x: game.camera.x - 500
							},
							200, 'Linear', false, 1000
						);
						twn_2.onComplete.add(() => {
							this.enemy_turn.alpha = 0;
							this.turn_start = 2;
						}, this);
						twn.chain(twn_2);
						twn.start();
						
						
					}
					else if(this.turn_start == 2)
					{
						
						this.turn_start = 50;
						if(this.enemies.length == 0)
						{
							this.mode = 0;
							this.turn_start = 1;
						}
						else
						{
							var twn;
							var first_twn;
							for(var i = 0; i < this.enemies.length; i++)
							{
								if(i == 0)
								{
									twn = game.add.tween(this.enemies[i]);
									twn.to({x: this.enemies[i].x, y: this.enemies[i].y}, 50, 'Linear', false, 0);
									first_twn = twn;								
								}
								if(i + 1 == this.enemies.length)
									twn = this.enemies[i].move(true, twn);
								else
								{
									twn = this.enemies[i].move(false, twn);
								}
							}
							console.log(first_twn);
							first_twn.start();
						}
						//console.log(ally.stats.health);
					}
				break;
				
				case 3: // combat_actions 

					if(this.turn_start == 1)
					{
				
						graphics = game.add.graphics();
						graphics.beginFill(0xF88383, 0.5);
						graphics.lineStyle(2, 0x0000FF, 0.5);
						if(this.ally.tile_coord.y() < 49 && this.tile_data[this.ally.tile_coord.x()][this.ally.tile_coord.y() + 1].occupant != 'wall') graphics.drawRect(this.ally.x, this.ally.y+48, 48, 48);
						if(this.ally.tile_coord.y() > 0 && this.tile_data[this.ally.tile_coord.x()][this.ally.tile_coord.y() - 1].occupant != 'wall') graphics.drawRect(this.ally.x, this.ally.y-48, 48, 48);
						if(this.ally.tile_coord.x() > 0 && this.tile_data[this.ally.tile_coord.x() + 1][this.ally.tile_coord.y()].occupant != 'wall') graphics.drawRect(this.ally.x+48, this.ally.y, 48, 48);
						if(this.ally.tile_coord.x() < 49 && this.tile_data[this.ally.tile_coord.x() - 1][this.ally.tile_coord.y()].occupant != 'wall') graphics.drawRect(this.ally.x-48, this.ally.y, 48, 48);
						graphics.endFill();
						//window.graphics = graphics;
						this.turn_start = 2;
					}
					else if(this.turn_start == 2)
					{
						
					}
				
				break;
				
			}
		}
		
	},// End update 
	
	on_click: function(pointer, event)
	{// when the user clicks
	
		var index_x = this.layer1.getTileX(game.input.activePointer.worldX);
		var index_y = this.layer1.getTileY(game.input.activePointer.worldY);
		var tile = this.tile_data[index_x][index_y];
		switch(this.mode)
		{// this.mode selection onclick 
		
			case 0: // when nothing else is happening 
				if(tile.occupied && event.button == 0)
				{// select if ally is click 
					if(tile.occupant instanceof Ally)
					{
						this.ally = tile.occupant;
						this.mode = 1;
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
					this.mode = 0;
					tile.occupant.bounds.alpha = 0.0;
				}
				else if(event.button == 0)
				{// left click  
					this.dark.clean_darkmap();
					var map_y = this.ally.stats.movement + (index_x - this.layer1.getTileX(this.ally.x));
					var map_x = this.ally.stats.movement + (index_y - this.layer1.getTileY(this.ally.y));
					
					var test_arr = this.layer2.getTiles(game.input.activePointer.worldX, game.input.activePointer.worldY, 1, 1);
					
					if(this.ally.map_bool[map_x][map_y])
					{// if the area is moveable 
						this.tile_data[this.layer1.getTileX(this.ally.x)][this.layer1.getTileY(this.ally.y)].occupied = false;
						this.tile_data[this.layer1.getTileX(this.ally.x)][this.layer1.getTileY(this.ally.y)].occupant = null;
						
						var arr = new Array();
						this.ally.dijikstra_tree_search(map_y, map_x, this.ally.dijikstra_tree, arr);
						var prev_twn;
						var first_twn;
						for(var i = 0; i < arr.length; i++)
						{// create chained tweens
							var twn = game.add.tween(this.ally);
							if(i + 1 == arr.length)
							{// do complete on last tween 
								twn.onComplete.add(() => {
									this.tile_data[this.layer1.getTileX(this.ally.x)][this.layer1.getTileY(this.ally.y)].occupied = true;
									this.tile_data[this.layer1.getTileX(this.ally.x)][this.layer1.getTileY(this.ally.y)].occupant = this.ally;
									this.mode = 2;
									this.turn_start = 1;
									this.darkmap_redraw();
									this.ally.bounds.alpha = 0.0;	
									this.standbutton.visible = true;
								
									if(test_arr[0].index == -1)
									{	
										//game.paused = true;
										//here is where the menu should be called to pop up.
										
										this.attackbutton.visible = false;
										
										if( this.tile_data[this.layer1.getTileX(this.ally.x-48)][this.layer1.getTileY(this.ally.y)].occupant instanceof Enemy ||
											this.tile_data[this.layer1.getTileX(this.ally.x+48)][this.layer1.getTileY(this.ally.y)].occupant instanceof Enemy ||
											this.tile_data[this.layer1.getTileX(this.ally.x)][this.layer1.getTileY(this.ally.y-48)].occupant instanceof Enemy ||
											this.tile_data[this.layer1.getTileX(this.ally.x)][this.layer1.getTileY(this.ally.y+48)].occupant instanceof Enemy
										){
											this.attackbutton.visible = true;
										}
										this.mode = 50;
										
									}
								}, this);
							}
							else
							{
								twn.onComplete.add(() => {
									//darkmap_redraw();
								}, this);
							}
							twn.onStart.add(function(){	if(walk1.isplaying){}else{walk1.play();}},this)
							twn.to(
							{// tween to move one block 
								x: (this.ally.tile_coord.x() + (arr[i].x - this.ally.stats.movement)) * 48, 
								y: (this.ally.tile_coord.y() + (arr[i].y - this.ally.stats.movement)) * 48
							}, 50, 'Linear', false, 0);
							if(i != 0)
								prev_twn.chain(twn);
							else if (i == 0)
								first_twn = twn;
							prev_twn = twn;	
						}
						first_twn.start();
						this.mode = 50;
						
						//this.ally.x = index_x * 48;
						//this.ally.y = index_y * 48;
						
					}
				}
			break;
			
			case 2: break; // there should be nothing during mode 2
			
			
			case 3: // combat mode 
				var mouseindex_x = this.layer1.getTileX(game.input.activePointer.worldX);
				var mouseindex_y = this.layer1.getTileY(game.input.activePointer.worldY);
				var tile2 = this.tile_data[mouseindex_x][mouseindex_y];
				
				if(event.button == 0)
				{
					if(
						tile2 == this.tile_data[this.layer1.getTileX(this.ally.x-48)][this.layer1.getTileY(this.ally.y)] ||
						tile2 == this.tile_data[this.layer1.getTileX(this.ally.x+48)][this.layer1.getTileY(this.ally.y)] ||
						tile2 == this.tile_data[this.layer1.getTileX(this.ally.x)][this.layer1.getTileY(this.ally.y-48)] ||
						tile2 == this.tile_data[this.layer1.getTileX(this.ally.x)][this.layer1.getTileY(this.ally.y+48)]
					){
						if(tile2.occupant instanceof Enemy)
						{
							//if enemy, attack
							var c = new Combat(this.ally, tile2.occupant);
							c.play();
							graphics.destroy();
							this.attackbutton.visible = false;
							this.standbutton.visible = false;
							this.mode = 2;
							this.turn_start = 1;
								
						}
					}
				}
				/*
				else if(event.button == 2)
				{
					
				}
				*/
			break;
		}// End switch 
		
		
	},// End on_click

	darkmap_redraw: function()
	{// redraws the darkness 
		this.dark.clean_darkmap();
		this.allies.forEach((obj) => {
			obj.update_darkness(this.dark);
		}, this);
		this.enemies.forEach((obj) => {
			obj.update_darkness(this.dark);
		}, this);
		this.dark.draw_darkmap();
	},// End darkmap_redraw 

}// End playGame