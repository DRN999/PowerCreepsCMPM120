
function HpBar(game,character)
{
	Phaser.Sprite.call(this,game);
	maxbar = game.add.bitmapData(70,70);//maximum size
    maxbar.ctx.beginPath();
    maxbar.ctx.rect(0,0,48,5);//third one is the length, fourth one is the width
    maxbar.ctx.fillStyle = '#FF0000'; //hpbar color, the red bar
    maxbar.ctx.fill();
        
    maxhpbar = this.game.add.sprite(character.x,character.y,maxbar);
	
	currentbar = game.add.bitmapData(70,70);//maximum size
    currentbar.ctx.beginPath();
    currentbar.ctx.rect(0,0,48,5);
    currentbar.ctx.fillStyle = '#13FF00'; //the green bar
    currentbar.ctx.fill();
	currentbar = this.game.add.sprite(character.x,character.y,currentbar);
	console.log("hpbar created");
}

HpBar.prototype = Object(Phaser.Sprite.prototype);
HpBar.prototype.constructor = HpBar;

HpBar.prototype.change = function(character)
{
	//if(character.name ==ally)
	
	percentage = game.math.roundTo(character.stats.health/character.stats.maxhealth,-2);
	//if(currentbar.width/maxbar.width > percentage){
		currentbar.width = currentbar.width - 0.2;
		game.camera.shake(0.005, 500); //the first is power of shaking, the second is the duration
		game.camera.flash(0xff0000, 500);		//the first is the color, the second is the duration
	//}		//reduced slowly
}
