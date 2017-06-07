

function HpBar(game)
{
	Phaser.Graphics.call(this,game, 0, 0);
	this.alpha = 1;
	/*
	maxbar = game.add.bitmapData(70,70);//maximum size
    maxbar.ctx.beginPath();
    maxbar.ctx.rect(0,0,48,5);//third one is the length, fourth one is the width
    maxbar.ctx.fillStyle = '#FF0000'; //hpbar color, the red bar
    maxbar.ctx.fill();
    */
	
	/*
    maxhpbar = this.game.add.sprite(character.x,character.y,maxbar);
	
	currentbar = game.add.bitmapData(70,70);//maximum size
    currentbar.ctx.beginPath();
    currentbar.ctx.rect(0,0,48,5);
    currentbar.ctx.fillStyle = '#13FF00'; //the green bar
    currentbar.ctx.fill();
	currentbar = this.game.add.sprite(character.x,character.y,currentbar);
	console.log("hpbar created");
	*/
	
}

HpBar.prototype = Object(Phaser.Graphics.prototype);
HpBar.prototype.constructor = HpBar;

HpBar.prototype.redraw = function()
{
	
	var max = this.parent.stats.maxhealth;
	var current = this.parent.stats.health;
	var width = 48 / this.parent.scale.x;
	var height = 5;
	var green = current / max;
	var red = (max - current) / max;
	this.beginFill(0x00FF00, 1);
	this.drawRect(0, 0, width * green, height);
	this.beginFill(0xFF0000, 1);
	this.drawRect(width * green, 0, width * red, height);
	
}


HpBar.prototype.change = function()
{
	//if(character.name ==ally)
	
	//percentage = game.math.roundTo(character.stats.health/character.stats.maxhealth,-2);
	//if(currentbar.width/maxbar.width > percentage){
		//currentbar.width = currentbar.width - 0.2;
		this.redraw();
		game.camera.shake(0.005, 500); //the first is power of shaking, the second is the duration
		game.camera.flash(0xff0000, 500);		//the first is the color, the second is the duration
	//}		//reduced slowly
}
