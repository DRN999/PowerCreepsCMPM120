
var game = new Phaser.Game(2400, 2400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

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
	//game.load.image('diamond','assets/img/diamond.png');

}

var map;
var layer1;
var layer2;
var layer3;

function create() {
	player = game.add.sprite(10, 10, 'diamond');
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
	layer3 = map.createLayer('Decoration3');
    //  This resizes the game world to match the layer dimensions
   // layer.resizeWorld();

}

