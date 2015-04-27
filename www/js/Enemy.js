var Enemy = function(scene)
{
	
	this.life = 2;
	
	Character.call(this, scene, {
		idle: {
			img : "sprite.idle-1",
			rowCount : 1,
			colCount : 16,
			loop : true
		},
		attack: {
			img : "sprite.attack-1",
			rowCount : 1,
			colCount : 12,
			loop : false
		},
		damage: {
			img : "sprite.damage-1",
			rowCount : 1,
			colCount : 15,
			loop : false
		},
		death: {
			img : "sprite.death-1",
			rowCount : 1,
			colCount : 14,
			loop : false
		},
	});

	this.creationTime = this.scene.game.timeData.local;
};

Enemy.FADE_OUT_DELAY = 1000;
Enemy.FADE_IN_DURATION = 500;
Enemy.MaxPopDelay = 5000;
Enemy.MinPopDelay = 500;
Enemy.MaxEnemyY = 1996;
Enemy.MinEnemyY = 1571;
Enemy.MaxEnemyX = 3500;
Enemy.MinEnemyX = 2500;

Enemy.prototype = new Character();

Enemy.prototype.draw = function(g)
{
    g.save();
        var t = (g.timeData.local - this.creationTime) / Enemy.FADE_IN_DURATION;
        if (t < 1)
        {
            var v = Easing.easeOutElastic(t);
            g.globalAlpha = v > 1 ? 1:v;
            g.translate(this.x, this.y);
            g.scale(v, v);
            g.translate(-this.x, -this.y);
        }
        if (g.timeData.local > this.deathTime + Enemy.FADE_OUT_DELAY)
        {
            this.scene.removeEnemy(this);
        }
        Character.prototype.draw.call(this, g);
    g.restore();
}

Enemy.prototype.hit = function()
{
	var self = this;
	if(this.life > 0)
	{
		this.life --;

		if(this.life > 0)
		{
			this.setSprite("damage", function(){
				self.setSprite("idle");
				console.log("idle");
			});
			return false;
		}
		else
		{
		    console.log("death");
		    this.nextSpriteId = false;
			this.setSprite("death", function(){
			    self.deathTime = self.game.timeData.local;
			});
			return true;
		}
	}
	else
	{
		return false;
	}
}