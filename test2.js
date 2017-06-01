


var canvas_width = 1280;
var canvas_height = 720;
var game = new Phaser.Game(canvas_width, canvas_height, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update });

function preload() {


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
	
}

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

var player_turn = true;
var mode = 0;
/*
* mode 0: your turn, nothing selected(hovering over things)
* mode 1: selected ally unit 
*/
var menu = false;

var tile_data = init_tiledata(50,50);// contains the data of each tile 

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

function create() 
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
}

function update()
{
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
				var map_y = 8 + (index_x - layer1.getTileX(ally.x));
				var map_x = 8 + (index_y - layer1.getTileY(ally.y));
				console.log("mpx: " + map_x);
				console.log("mpy: " + map_y);
				console.log(ally.map[map_x][map_y]);
				if(ally.map_bool[map_x][map_y])
				{
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
				/*
				if(Math.abs(index_x - layer1.getTileX(ally.x)) + Math.abs(index_y - layer1.getTileY(ally.y)) < ally.stats.movement)
				{
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
				*/
			}
		//placeholder = game.add.sprite(game.camera.x - 20, game.camera.y + 500, 'placeholder');
		
		attackbutton = game.add.button(game.camera.x + 1140, game.camera.y + 360, 'attackbutton');
		standbutton= game.add.button(game.camera.x + 1140, game.camera.y + 280, 'standbutton');
		attackbutton.onInputUp.add(upAttack, this);
		attackbutton.onInputUp.add(overAttack, this);
		standbutton.onInputUp.add(upStand, this);
		standbutton.onInputUp.add(overStand, this);
		
		game.paused = true;
		console.log('moved'); //here is where the menu should be called to pop up.
		break;
		
		case 2: break; // there should be nothing during mode 2
			
	}
	
}// End on_click

//button functions, up* functions are when the click is released, perform attack within this function.
function upAttack() {
    console.log('button up', arguments);
	// attack should happen here
	
	
	
	game.paused = false;
	//placeholder.destroy();
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
