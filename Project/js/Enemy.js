// Enemy Object 

function Enemy(game, key, frame, size, p_x, p_y, scale)
{// Enemy Constructor 

	
	Phaser.Sprite.call(this, game, p_x, p_y, key, frame);
	
	this.scale.x = scale // set the scales 
	this.scale.y = scale; 
	
	this.anchor.setTo(0.5, 0.5);
	
	this.turning = true;
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// timer for stopping rotation 
	this.timer_rotate = game.time.create(false);
	this.timer_rotate.loop(1000, () => {
		this.turning = true;
		this.timer_rotate.pause();
		
	}, this);
	this.timer_rotate.start();
	this.timer_rotate.pause();
	
	// init view 
	this.graphics = game.add.sprite(p_x, p_y, 'search');
	this.graphics.scale.x = scale;
	this.graphics.scale.y = scale;
	this.graphics.anchor.setTo(0.5, 0.0);
	game.physics.arcade.enable(this.graphics);
	game.add.existing(this.graphics);
	
	// init angle_set 
	this.angle_set = 0;
	
	this.mode = Math.floor(Math.random() * 2); // randomly select the mode of the AI
	
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
		// In the current state there is only this simple rotation changing with only 2 modes
		// but in the future there will be a lot more movement modes to make the AI much more complex 
		this.angle = parseInt(this.angle_set * (this.mode ? 1 : -1)); 
		this.graphics.angle = this.angle;
	}
	
	if(this.angle % 90 == 0)
	{// stops the rotation of the enemy every 90 degrees it rotates 
		this.turning = false;
		this.timer_rotate.resume();
	}
	
	
}// End update 

