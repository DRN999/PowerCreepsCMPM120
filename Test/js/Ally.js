
function Ally(game, key, frame, size, p_x, p_y, scale) 
{
	Phaser.Sprite.call(this, game, p_x, p_y, key, frame);
	
	this.scale.x = scale // set the scales 
	this.scale.y = scale; 
	game.physics.enable(this);
	this.body.collideWorldBounds = false;
	
	this.stats = {
		movement: 8,
		health: 20,
		def: 0,
		atk: 5,
		spd: 8
	};
	
	this.tile_coord = 
	{
		x: () => layer1.getTileX(this.x),
		y: () => layer1.getTileX(this.y)
	};
	
	this.bounds = game.add.graphics();
	this.update_bounds();
	this.bounds.alpha = 0.0;
	
}

Ally.prototype = Object.create(Phaser.Sprite.prototype);
Ally.prototype.constructor = Ally;

Ally.prototype.update_bounds = function()
{
	this.bounds.clear();
    this.bounds.lineStyle(2, 0x0000FF, 1);
	this.bounds.beginFill(0x0000FF);
	for(var i = 0; i <= this.stats.movement * 2; i++)
	{
		for(var j = 0; j <= this.stats.movement * 2; j++)
		{
			var draw = true;
			var bound_x = i - this.stats.movement;
			var bound_y = j - this.stats.movement;
			if(bound_x < 0 && bound_y < 0)
				draw = (bound_x + bound_y < this.stats.movement * -1) ? false : true;
			else if(bound_x < 0 && bound_y > 0)
				draw = (bound_x * -1 + bound_y > this.stats.movement) ? false : true;
			else if(bound_x > 0 && bound_y < 0)
				draw = (bound_x + bound_y * -1 > this.stats.movement) ? false : true;
			else if(bound_x > 0 && bound_y > 0)
				draw = (bound_x + bound_y > this.stats.movement) ? false : true;
			
			if(draw){
				var rect = this.bounds.drawRect((this.tile_coord.x() + bound_x) * 48, (this.tile_coord.y() + bound_y) * 48, 48, 48);
			}
		}
	}
}

Ally.prototype.update = function()
{// update, change direction when the ship reaches the end of the screen 
	
	
}// End update 



