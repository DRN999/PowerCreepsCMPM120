
function init_tiledata(width, height) 
{// inititalize tile_data 
	var ret = new Array();
	for(var i = 0; i < width; i++)
	{
		var temp = new Array();
		for(var j = 0; j < height; j++)
		{
			temp.push
			({
				collide: false,
				occupied: false,
				name: "floor",
				occupant: null
				
			});
		}
		ret.push(temp);
	}
	return ret;
}// End init_tiledata 
