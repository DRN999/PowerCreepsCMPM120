
function Combat(atk, def)
{// initiation of combat 
	this.attaker = atk;
	this.defender = def;
	this.hit_prob = atk.stats.acc / def.stats.spd;
	if(this.hit_prob > 1)
		this.hit_prob = 1;
	this.rand = Math.random();
	this.evade = false;
	if(this.rand > this.hit_prob)
		this.evade = true;
	this.damage = atk.stats.atk - def.stats.def;
	if(this.damage < 0)
		this.damage = 0;
}// End constructor 

Combat.prototype.play = function()
{// performing the combat 
	
	if(this.evade)
	{// if defender dodges 
		console.log('missed');
		miss.play();
	}
	else
	{
		console.log('hit');
		this.defender.stats.health -= this.damage;
		this.defender.children[0].change();
		if(this.defender.stats.health <= 0)
		{// if defender dies 
			this.defender.bounds.alpha = 0.0;
			this.defender.death_event();
			this.defender.erase();
		}
	}
}// End play 

