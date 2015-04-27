var Sprite = function(image, colCount, rowCount, loop)
{
	this.image = image;
	this.colCount = colCount;
	this.rowCount = rowCount;
	this.frameCount = this.colCount * this.rowCount;
	this.frameWidth = this.image.width / this.colCount;
	this.frameHeight = this.image.height / this.rowCount;
	this.setFrameRate(16);
	this.lastFrameUpdate = 0;
	this.currentFrame = 0;
	this.loop = loop;
};

Sprite.prototype.setFrameRate = function(fps)
{
	this.frameRate = fps;
	this.frameDuration = 1 / this.frameRate * 1000;
};

Sprite.prototype.play = function(endAnimationListener, game)
{
	//reset de l'anim
	this.currentFrame = 0;
	//mise à jour sur l'heure courante (temps depuis le début du jeu)
	this.lastFrameUpdate = game.timeData.local;
	
	//enregistre le listener
	this.endAnimationListener = endAnimationListener;
};

Sprite.prototype.draw = function(g)
{
	var elapsedTime = g.timeData.local - this.lastFrameUpdate;
	
	//Si elapsedTime > durée d'une frameCount
	//calculer nombre de frames écoulées et mettre à jour currentFrame
	if(elapsedTime >= this.frameDuration)
	{
		this.elapsedFrame = Math.floor(elapsedTime / this.frameDuration);
		if(this.loop)
		{
			this.currentFrame = (this.currentFrame + this.elapsedFrame) % this.frameCount;
		}
		else
		{
			if(this.currentFrame == this.frameCount - 1)
			{
				if(this.endAnimationListener)
				{
					var listener = this.endAnimationListener;
					this.endAnimationListener = false;
					listener();
				}
			}
			else
			{
				this.currentFrame = (this.currentFrame + this.elapsedFrame) % this.frameCount;
			}
		}	
		this.lastFrameUpdate = g.timeData.local;
	}
	
	//this.currentFrame = 5;
	
	var currentCol = this.currentFrame % this.colCount;
	var currentRow = Math.floor(this.currentFrame / this.colCount);

	g.drawImage(this.image, 
		this.frameWidth * currentCol, this.frameHeight * currentRow, this.frameWidth, this.frameHeight,
		0, 0, this.frameWidth, this.frameHeight
	);
};