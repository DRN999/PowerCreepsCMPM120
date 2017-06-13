function createlevelone(game){
	Phaser.Tilemap.call(this);
	console.log("level1 enter");
}

createlevelone.prototype = Object(Phaser.Tilemap.prototype);
createlevelone.prototype.constructor = createlevelone;


createlevelone.prototype.preload = function(){
	game.load.image('tileset1','assets/img/tileset/free/1.png');
	game.load.image('tileset2','assets/img/tileset/free/2.png');  
	game.load.image('tileset3','assets/img/tileset/free/3.png');  
	game.load.image('tileset4','assets/img/tileset/free/4.png');  
	game.load.image('tileset5','assets/img/tileset/free/5.png');  
	game.load.image('tileset6','assets/img/tileset/free/6.png');  
	game.load.tilemap('village','assets/village.json',null, Phaser.Tilemap.TILED_JSON);
}

createlevelone.prototype.create = function(){
	game.stage.backgroundColor = '#000000';
	map = game.add.tilemap('village');
    map.addTilesetImage('free1', 'tileset1');
	map.addTilesetImage('free2', 'tileset2');
	map.addTilesetImage('free3', 'tileset3');
	map.addTilesetImage('free4', 'tileset4');
	map.addTilesetImage('free5', 'tileset5');
	map.addTilesetImage('free6', 'tileset6');
	
	
    layer1 = map.createLayer('ground');
	layer2 = map.createLayer('ground2');
	layer3 = map.createLayer('wall');
	layer4 = map.createLayer('walldec');
	
	map.setCollisionByExclusion([],true,layer3);
	
    layer1.resizeWorld();
	layer2.resizeWorld();
	layer3.resizeWorld();
	layer4.resizeWorld();
	console.log("level1 complete");
}
//createlevelone.prototype.preUpdate = function(){}
//createlevelone.prototype.update = function(){}
//createlevelone.prototype.postUpdate = function(){}
//createlevelone.prototype.updateTransform = function(){}
//createlevelone.prototype._renderWebGL = function(){}