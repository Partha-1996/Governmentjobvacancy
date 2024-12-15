var canvas = document.getElementById("canvas");
	var width = canvas.width = 450;
	var height = canvas.height = 450;
	var ctx = canvas.getContext("2d");
	var current = 0;
	var dataNum;
	var json;
	var ScrrenPoint;
	var angle = 0;
	var data = [
	            		{url:'https://hankuro.sakura.ne.jp/json/animal/elk.json' , point:{x:-100,y:0} , scale:{x:1,y:1}},
	            		{url:'https://hankuro.sakura.ne.jp/json/animal/wolf.json' , point:{x:100,y:100} , scale:{x:1,y:1}},
	            		{url:'https://hankuro.sakura.ne.jp/json/animal/fox.json' , point:{x:70,y:0} , scale:{x:1,y:1}},
	            		{url:'https://hankuro.sakura.ne.jp/json/animal/retreiver.json' , point:{x:80,y:-150} , scale:{x:1,y:1}}
	                ];
	var animes = [];

	data.forEach(function(d,i){animes.push(new animestion(i));});
	var perv = 0 , m = 0;
	d3.timer(function(elapsed){
		m += (elapsed - perv);
		perv = elapsed;
		if(m < 30) return;
		m = 0;
		ctx.setTransform(1,0,0,1,0,0);
		ctx.clearRect(0,0,width,height);
		animes.forEach(function(a){
			if(a.ready) a.draw();
		})
	})


	function animestion(index){
		var url = data[index].url;
		this.point = data[index].point;
		this.scale =  data[index].scale;
		this.ready = false;
		d3.json(url, function(error, root) {
			this.json = root;
			this.ScrrenPoint = new vertex();
			this.angle = 0;
			this.current = 0;
			this.ready = true;
		}.bind(this))
	}
	animestion.prototype.draw = function(){
		ctx.setTransform(1,0,0,1,0,0);
		ctx.translate(width/2+this.point.x,height/2-this.point.y);
		ctx.scale(this.scale.x,-this.scale.y);
		ctx.fillStyle = "rgba(255,255,255,0.8)";
		this.current = this.current + 1 != this.json.morphTargets.length ?  this.current : 0;
		var vecs = this.json.morphTargets[this.current].vertices;
		var sin = Math.sin(this.angle);
		var cos = Math.cos(this.angle);
		for(var i=0;i<vecs.length;i+=3){
			var p = [vecs[i+0],vecs[i+1],vecs[i+2]];
			var po = [0,0,0];
			po[0] = cos * p[0]  - sin * p[2] ;
			po[1] = p[1] - 30;
			po[2] =  cos * p[2]  + sin * p[0];
			this.ScrrenPoint.setVertex(po);
			var sp = this.ScrrenPoint.getScrrenPoint();
			ctx.fillRect(sp.x,sp.y,1/this.scale.x,1/this.scale.y);
		}
		this.current++;
		this.angle += 0.01;
	}

	function vertex(){
		this.x = 0;
	    this.y = 0;
	    this.z = 0;
	    this.fl = 1000;
	}
	vertex.prototype.setVertex = function(p){
		this.x = p[0];
	    this.y = p[1];
	    this.z = p[2];
	}
	vertex.prototype.getScrrenPoint = function(){
		var scale_z = this.fl + this.z;
	    var scale = this.fl / scale_z;
	    var x = this.x * scale;
	    var y = this.y * scale;
	    return {x:x , y:y , scale:scale};
	}