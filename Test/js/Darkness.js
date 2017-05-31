

function Darkness(game, tile_width, tile_height)
{
	Phaser.Graphics.call(this, game, 0, 0)
	this.dark_map = this.get_new_darkmap(tile_width, tile_height);
	this.alpha = 1;
}

Darkness.prototype = Object.create(Phaser.Graphics.prototype);
Darkness.prototype.constructor = Darkness;

Darkness.prototype.get_new_darkmap = function(tile_width, tile_height)
{// inits the opacity array 
	var ret = new Array();
	for(var i = 0; i < tile_height; i++)
	{
		var temp = new Array();
		for(var j = 0; j < tile_width; j++)
		{
			temp.push(0);
		}
		ret.push(temp);
	}
	return ret;
}// End get_new_darkmap 

Darkness.prototype.clean_darkmap = function() 
{// checks for any overflow 
	for(var i = 0; i < this.dark_map.length; i++)
	{	
		for(var j = 0; j < this.dark_map[i].length; j++)
		{
			if(this.dark_map[i][j] > 1)
				this.dark_map[i][j] = 1;
		}	
	}
}// End clean_darkmap

Darkness.prototype.add_coord(x, y, alpha)
{// adds the alpha to the specified coordinate
	this.dark_map[y][x] += alpha;
	if(this.dark_map[y][x] > 1)
		this.dark_map[y][x] = 1;
}// End add_coord 

Darkness.prototype.draw_darkmap = function()
{// re_draws the darkmap 
	this.clear();
	for(var i = 0; i < this.dark_map.length; i++)
	{
		for(var j = 0; j < this.dark_map[i].length; j++)
		{
			this.beginFill(0x000000, 1 - this.dark_map[i][j]);
			this.drawRect(j * 48, i * 48, 48, 48)
			
		}	
	}
}// End draw_darkmap 


