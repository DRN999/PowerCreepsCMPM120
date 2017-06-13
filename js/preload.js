
var preload = function(game) {};
preload.prototype = {
	preload: function() 
	{
		game.load.tilemap('test', 'maps/Test1.json', null, Phaser.Tilemap.TILED_JSON);

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
		game.load.audio('click1','assets/audio/SE/click1.wav');
		game.load.audio('click2','assets/audio/SE/click2.wav');
		game.load.audio('hit1','assets/audio/SE/hit1.wav');
		game.load.audio('sword1','assets/audio/SE/sword1.wav');
		game.load.audio('sword2','assets/audio/SE/sword2.wav');
		game.load.audio('sword3','assets/audio/SE/sword3.wav');
		game.load.audio('sword4','assets/audio/SE/sword4.wav');
		game.load.audio('miss', 'assets/audio/SE/swing2.mp3');
		game.load.audio('walk1','assets/audio/SE/walk1.mp3');
		game.load.audio('BM1','assets/audio/music/BM1.wav');
		game.load.audio('BM2','assets/audio/music/BM2.mp3');
		game.load.audio('BM3','assets/audio/music/BM3.mp3');
		//turn art 
		game.load.image('player_turn', 'assets/img/playerturn.png');
		game.load.image('enemy_turn', 'assets/img/enemyturn.png');
		
		
		game.load.spritesheet('character', 'assets/img/vx_chara01_a.png', 32, 48, 12);
		
		// title and ending preload
		game.load.image('TitleBG', 'assets/img/TitleScreennoBlood.png');
		
		// UI/text preload
		this.load.bitmapFont('MainFont', 'assets/font/font.png', 'assets/font/font.fnt');
		game.load.image('playButton', 'assets/img/blood.png');
		game.load.image('restartButton', 'assets/img/restart.png');
		game.load.image('dayButton', 'assets/img/dayButton.png');
		game.load.image('nightButton', 'assets/img/nightButton.png');

	},
	
	create: function() {
		click1 = game.add.audio('click1');
		click2 = game.add.audio('click2');
		hit1 = game.add.audio('hit1');
		sword1 = game.add.audio('sword1');
		sword2 = game.add.audio('sword2');
		sword3 = game.add.audio('sword3');
		sword4 = game.add.audio('sword4');
		miss = game.add.audio('miss');
		walk1 = game.add.audio('walk1');
		BM1 = game.add.audio('BM1');
		BM2 = game.add.audio('BM2');
		BM3 = game.add.audio('BM3');
		BM1.loop = true;
		BM1.volume = 0.2;
		BM2.loop = true;
		BM2.volume = 0.2;
		Sounds = [sword1,sword2,sword3,sword4,hit1];
		// preload the 9patch box
		//game.cache.addNinePatch('blue_button02', 'blueSheet', 'blue_button02.png', 10, 10, 10, 20);
		// move to title screen
		this.game.state.start('IntroScreen');
	}
}// End preload 
