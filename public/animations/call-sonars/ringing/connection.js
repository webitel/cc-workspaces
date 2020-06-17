(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"connection_atlas_", frames: [[90,177,52,51],[102,0,64,63],[0,0,100,98],[0,100,88,86],[90,100,76,75],[42,188,28,28],[0,188,40,39]]}
];


// symbols:



(lib.CachedTexturedBitmap_10 = function() {
	this.initialize(ss["connection_atlas_"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_11 = function() {
	this.initialize(ss["connection_atlas_"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_12 = function() {
	this.initialize(ss["connection_atlas_"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_13 = function() {
	this.initialize(ss["connection_atlas_"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_14 = function() {
	this.initialize(ss["connection_atlas_"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_8 = function() {
	this.initialize(ss["connection_atlas_"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedTexturedBitmap_9 = function() {
	this.initialize(ss["connection_atlas_"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Path_6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedTexturedBitmap_14();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_6, new cjs.Rectangle(0,0,38,37.5), null);


(lib.Path_5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedTexturedBitmap_13();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_5, new cjs.Rectangle(0,0,44,43), null);


(lib.Path_4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedTexturedBitmap_12();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_4, new cjs.Rectangle(0,0,50,49), null);


(lib.Path_3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedTexturedBitmap_11();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_3, new cjs.Rectangle(0,0,32,31.5), null);


(lib.Path_2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedTexturedBitmap_10();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_2, new cjs.Rectangle(0,0,26,25.5), null);


(lib.Path_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedTexturedBitmap_9();
	this.instance.parent = this;
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = getMCSymbolPrototype(lib.Path_1, new cjs.Rectangle(0,0,20,19.5), null);


(lib.Анимация1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedTexturedBitmap_8();
	this.instance.parent = this;
	this.instance.setTransform(-7,-6.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-7,-6.8,14,14);


// stage content:
(lib.connection = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer_1___копия
	this.instance = new lib.Анимация1("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(26,26.15);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(9).to({startPosition:0},0).to({alpha:0.6992},10).wait(51));

	// Layer_1___копия
	this.instance_1 = new lib.Path_1();
	this.instance_1.parent = this;
	this.instance_1.setTransform(26,26.2,1,1,0,0,0,10,9.8);
	this.instance_1.alpha = 0.6016;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(9).to({alpha:1},10).to({alpha:0.6016},10).wait(41));

	// Layer_1___копия
	this.instance_2 = new lib.Path_2();
	this.instance_2.parent = this;
	this.instance_2.setTransform(26,26.15,1,1,0,0,0,13,12.7);
	this.instance_2.alpha = 0.5;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(19).to({alpha:1},10).to({alpha:0.5},10).wait(31));

	// Layer_1___копия
	this.instance_3 = new lib.Path_3();
	this.instance_3.parent = this;
	this.instance_3.setTransform(26,26.2,1,1,0,0,0,16,15.7);
	this.instance_3.alpha = 0.3984;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(29).to({alpha:1},10).to({alpha:0.3984},10).wait(21));

	// Layer_1___копия
	this.instance_4 = new lib.Path_6();
	this.instance_4.parent = this;
	this.instance_4.setTransform(26,26.15,1,1,0,0,0,19,18.6);
	this.instance_4.alpha = 0.3008;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(39).to({alpha:1},10).to({alpha:0.3008},10).wait(11));

	// Layer_1___копия
	this.instance_5 = new lib.Path_5();
	this.instance_5.parent = this;
	this.instance_5.setTransform(26,26.2,1,1,0,0,0,22,21.6);
	this.instance_5.alpha = 0.1992;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(49).to({alpha:1},10).to({alpha:0.1992},10).wait(1));

	// Layer_1___копия
	this.instance_6 = new lib.Path_4();
	this.instance_6.parent = this;
	this.instance_6.setTransform(26,26.15,1,1,0,0,0,25,24.5);
	this.instance_6.alpha = 0.1016;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(59).to({alpha:1},10).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(27,27.7,24,23.000000000000004);
// library properties:
lib.properties = {
	id: '4EA8D1F44057AF468591EDCE009DA2B0',
	width: 52,
	height: 52,
	fps: 90,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/connection_atlas_.png", id:"connection_atlas_"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['4EA8D1F44057AF468591EDCE009DA2B0'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;