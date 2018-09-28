window.onload = function() {
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");
	var width = canvas.width = window.innerWidth;
	var height = canvas.height = window.innerHeight;
	var slider = document.getElementById("myRange");
	slider.min = 0;
	slider.max = Math.PI / 2;
	slider.step = 0.01;
	slider.value = Math.PI / 6;
	context.strokeStyle = "#53350A";
	
	// Draw the ground from an external square texture.
	groundTexture = new Image();
	groundTexture.src = 'grass.jpg';
	groundTexture.onload = function() {
		for(let i = 0; i < width; i += 100)
			context.drawImage(groundTexture, i, height - 100, 100, 100);
	}
	
	var p0 = {
		x: width / 2,
		y: height - 100
	};
	
	var p1 = {
		x: width / 2,
		y: 100
	};
	
	//var branchAngleA = randomRange(-Math.PI / 2, Math.PI / 2);
	//var branchAngleB = randomRange(-Math.PI / 2, Math.PI / 2);
	var branchAngle = Number(slider.value);
	var trunkRatio = 0.5;
	
	function randomRange(min, max) {
		return min + Math.random() * (max - min);
	}
	
	var drawingLimit = 0;
	tree(p0, p1, drawingLimit);
	
	slider.oninput = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		for(let i = 0; i < width; i += 100)
			context.drawImage(groundTexture, i, height - 100, 100, 100);
		branchAngle = Number(slider.value);
		tree(p0, p1, drawingLimit);
	}
	
	function tree(p0, p1, limit) {
		var dx = p1.x - p0.x;
		var dy = p1.y - p0.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		var angle = Math.atan2(dy, dx);
		var branchLength = dist * (1 - trunkRatio);
		
		var pA = {
			x: p0.x + dx * trunkRatio,
			y: p0.y + dy * trunkRatio
		};
		var pB = {
			x: pA.x + Math.cos(angle + branchAngle) * branchLength,
			y: pA.y + Math.sin(angle + branchAngle) * branchLength
		};
		var pC = {
			x: pA.x + Math.cos(angle - branchAngle) * branchLength,
			y: pA.y + Math.sin(angle - branchAngle) * branchLength
		};
		
		context.lineWidth = 6;
		context.beginPath();
		context.moveTo(p0.x, p0.y);
		context.lineTo(pA.x, pA.y);
		context.stroke();
		
		if(limit > 0) {
			tree(pA, pB, limit - 1);
			tree(pA, pC, limit - 1);
		}
		else {
			context.lineWidth -= 2;
			
			context.beginPath();
			context.moveTo(pB.x, pB.y);
			context.lineTo(pA.x, pA.y);
			context.lineTo(pC.x, pC.y);
			context.stroke();
			
			// Draw leaves on the end points (pB, pC).
			context.fillStyle = "#82d435"; // Leaf green
			context.beginPath();
			context.arc(pB.x, pB.y, 6, 0, Math.PI*2,true);
			context.arc(pC.x, pC.y, 6, 0, Math.PI*2,true);
			context.closePath();
			context.fill();
		}
	}
	
	document.getElementById("myButton").onclick = function buildBiggerTree(){
		if(drawingLimit < 8) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			for(let i = 0; i < width; i += 100)
				context.drawImage(groundTexture, i, height - 100, 100, 100);
			tree(p0, p1, ++drawingLimit);
		}
	}
}