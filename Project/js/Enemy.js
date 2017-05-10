
function Enemy(game, key, frame, size, p_x, p_y, scale)
{// Enemy Constructor 

	
	Phaser.Sprite.call(this, game, p_x, p_y, key, frame);
	
	this.scale.x = scale // set the scales 
	this.scale.y = scale; 
	
	this.anchor.setTo(0.5, 0.5);
	
	this.turning = true;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	this.timer_rotate = game.time.create(false);
	this.timer_rotate.loop(1000, () => {
		this.turning = true;
		this.timer_rotate.pause();
		
	}, this);
	this.timer_rotate.start();
	this.timer_rotate.pause();
	
	this.graphics = game.add.sprite(p_x, p_y, 'search');
	this.graphics.scale.x = scale;
	this.graphics.scale.y = scale;
	this.graphics.anchor.setTo(0.5, 0.0);
	game.physics.arcade.enable(this.graphics);
	game.add.existing(this.graphics);
	
	this.angle_set = 0;
	
	this.mode = Math.floor(Math.random() * 2);
	
	console.log(this);
	//window.graphics = graphics;
	
}// End Enemy constructor 

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function()
{// update, change direction when the ship reaches the end of the screen 
	
	if(this.turning)
	{	
		this.angle_set += 1;
		this.angle = parseInt(this.angle_set * (this.mode ? 1 : -1));
		this.graphics.angle = this.angle;
	}
	
	if(this.angle % 90 == 0)
	{
		this.turning = false;
		this.timer_rotate.resume();
	}
	
	
}// End update 

