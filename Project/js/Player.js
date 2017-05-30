
function Player(game, key, frame, size, p_x, p_y, scale)
{// Player Constructor 

	
	Phaser.Sprite.call(this, game, p_x, p_y, key, frame);
	
	this.scale.x = scale // set the scales 
	this.scale.y = scale; 
	
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	// used addKey instead of putting it in the update function, 
	// can comment out and use the commented section in update function instead (details in README)
	var key_up = game.input.keyboard.addKey(Phaser.Keyboard.W);
	key_up.onDown.add(() => { // add keyboard event
		move_up = true;
	}, this);
	key_up.onUp.add(() => {
		move_up = false;
	}, this);
	
	var key_down = game.input.keyboard.addKey(Phaser.Keyboard.S);
	key_down.onDown.add(() => { // add keyboard event
		move_down = true;
	}, this);
	key_down.onUp.add(() => {
		move_down = false;
	}, this);
	
	var key_left = game.input.keyboard.addKey(Phaser.Keyboard.A);
	key_left.onDown.add(() => { // add keyboard event
		move_left = true;
	}, this);
	key_left.onUp.add(() => {
		move_left = false;
	}, this);
	
	var key_right = game.input.keyboard.addKey(Phaser.Keyboard.D);
	key_right.onDown.add(() => { // add keyboard event
		move_right = true;
	}, this);
	key_right.onUp.add(() => {
		move_right = false;
	}, this);
	
}// End Player constructor 

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{// update, change direction when the ship reaches the end of the screen 
	
	if(move_up)
	{
		this.body.y -= 4;
	}
	if(move_down)
	{
		this.body.y += 4;
	}
	if(move_left)
	{
		this.body.x -= 4;
	}
	if(move_right)
	{
		this.body.x += 4;
	}
	
}// End update 