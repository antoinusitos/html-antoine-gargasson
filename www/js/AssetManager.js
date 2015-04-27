var AssetManager = function () {
    this.images = {};
    this.sounds = {};
    
    this.imagesError = {};
    this.imagesToLoad = {};
    this.soundsToLoad = {};

    this.loadingStarted = false;
    this.loadingEndTime = false;

    this.assetCount = 0;
    this.nbAssetLoaded = 0;

    this.loadingListener = [];
};

AssetManager.LOADING_DELAY = 0;

AssetManager.prototype.addLoadingListener = function (listener) {
    this.loadingListener.push(listener);
};

AssetManager.prototype.addImage = function(id, path)
{
    //this.imagesToLoad[id] = "getImage.php?sleep="+AssetManager.LOADING_DELAY+"&url="+encodeURIComponent(path);
    this.imagesToLoad[id] = path;
};

AssetManager.prototype.addSound = function (id, path)
{

};

AssetManager.prototype.loadImage = function (id, path)
{
    var self = this;
    if (!this.images[id])
    {
        var image = new Image();
        image.addEventListener("load", function () {
            self.assetLoaded();
            delete self.imagesToLoad[id];
        });
        image.addEventListener("error", function (e) {
            console.log("impossible de charger l'image : " + path);
            self.assetLoaded();
            self.imagesError[id] = path;
            delete self.imagesToLoad[id];
        });
        image.src = path;
        setTimeout(function () {
            if (image.complete && self.imagesToLoad[id]) {
                self.assetLoaded();
                delete self.imagesToLoad[id];
            }
        }, 500);
        this.images[id] = image;
    }    
};

AssetManager.prototype.loadSound = function (id, path)
{

};

AssetManager.prototype.getImage = function (id)
{
    return this.images[id];
};

AssetManager.prototype.getSound = function (id)
{
    return this.sounds[id];
};

AssetManager.prototype.startLoading = function (imageLoadingList, soundLoadingList) {
    //ajout des images à charger
    if (imageLoadingList)
    {
        for(var i in imageLoadingList)
        {
            this.addImage(i, imageLoadingList[i]);
        }
    }

    //inventaire des assets à charger
    this.assetCount = 0;
    for (var i in this.imagesToLoad)
    {
        this.assetCount++;
    }
    console.log("start loading " + this.assetCount + " elm");

    //chargement des images
    for(var i in this.imagesToLoad)
    {
        this.loadImage(i, this.imagesToLoad[i]);
    }
};

AssetManager.prototype.assetLoaded = function () {
    this.nbAssetLoaded++;
    console.log("asset loaded: " + this.nbAssetLoaded + "/" + this.assetCount);
    if(this.nbAssetLoaded == this.assetCount)
    {
        for(var i = 0; i < this.loadingListener.length; i++)
        {
            this.loadingListener[i]();
        }
    }
};

AssetManager.prototype.loadingProgression = function () {
    return Math.floor(this.nbAssetLoaded / this.assetCount * 100);
}