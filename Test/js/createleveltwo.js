function createleveltwo(game){
	Phaser.Tilemap.call(this);
	console.log("level2 enter");
}

createleveltwo.prototype = Object(Phaser.Tilemap.prototype);
createleveltwo.prototype.constructor = createleveltwo;


createleveltwo.prototype.preload = function(){
	game.load.image('tileset1','assets/img/tileset/free/1.png');
	game.load.image('tileset2','assets/img/tileset/free/2.png');  
	game.load.image('tileset3','assets/img/tileset/free/3.png');  
	game.load.image('tileset4','assets/img/tileset/free/4.png');  
	game.load.image('tileset6','assets/img/tileset/free/6.png');  
	game.load.tilemap('road','assets/road.json',null, Phaser.Tilemap.TILED_JSON);
}

createleveltwo.prototype.create = function(){
	game.stage.backgroundColor = '#000000';
	map = game.add.tilemap('road');
    map.addTilesetImage('free1', 'tileset1');
	map.addTilesetImage('free2', 'tileset2');
	map.addTilesetImage('free3', 'tileset3');
	map.addTilesetImage('free4', 'tileset4');
	map.addTilesetImage('free6', 'tileset6');
	
	
    layer1 = map.createLayer('ground');
	layer2 = map.createLayer('wall');
	layer3 = map.createLayer('walldec');
	
	map.setCollisionByExclusion([],true,layer2);
	map.setCollisionByExclusion([],true,layer3);
	
    layer1.resizeWorld();
	layer2.resizeWorld();
	layer3.resizeWorld();
	console.log("level2 complete");
}
//createleveltwo.prototype.preUpdate = function(){}
//createleveltwo.prototype.update = function(){}
//createleveltwo.prototype.postUpdate = function(){}
//createleveltwo.prototype.updateTransform = function(){}
//createleveltwo.prototype._renderWebGL = function(){}