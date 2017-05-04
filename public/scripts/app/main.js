(function () {
    var triangle = function (p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    };

    var middleTriangle = function (p1, p2, p3) {
        triangle.call(this, p1, p2, p3);
        this.isMiddle = true;
    };

    var initialTriangle = calculateInitialTriangleStartPoint();
    var   defaultTriangles = [
            initialTriangle
        ],
        allTriangles = [];

    function fillTriangle(triangle) {
        context.beginPath();
        var p1 = triangle.p1,
            p2 = triangle.p2,
            p3 = triangle.p3;

        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.lineTo(p3.x, p3.y);
        context.lineTo(p1.x, p1.y);

        if (triangle.isMiddle) {
            context.fillStyle = "white";
        } else {
            context.fillStyle = "black";
        }

        context.fill();
        context.closePath();
    };

    function generateTriangles(mainTriangle) {
        if (mainTriangle.isMiddle) {
            return [mainTriangle];
        }
        var midP1andP2 = calculateMiddle(mainTriangle.p1, mainTriangle.p2),
            midP1andP3 = calculateMiddle(mainTriangle.p1, mainTriangle.p3),
            midP2andP3 = calculateMiddle(mainTriangle.p2, mainTriangle.p3),

            topTriangle = new triangle(mainTriangle.p1, midP1andP2, midP1andP3),
            leftTriangle = new triangle(midP1andP2, mainTriangle.p2, midP2andP3),
            midTriangle = new middleTriangle(midP1andP2, midP2andP3, midP1andP3),
            rightTriangle = new triangle(midP1andP3, midP2andP3, mainTriangle.p3);


        return [
            topTriangle, leftTriangle, midTriangle, rightTriangle
        ];
    };

    function calculateInitialTriangleStartPoint() {
        //For equilateral triangle the height is sin60 * a(length of a side)
        //sin 60 (Math.sqrt(3)/2);
        //For start i am going to assume the screen size is initial window.innerWidth and window.innerHeight
        //It will be calculated to to find x and y for starting to draw triangle
        var sin60 = Math.sqrt(3) / 2;
        var screenHeight = window.innerHeight;
        var screenWidth = window.innerWidth;
        var width, height;

        if (sin60 * screenWidth < screenHeight) {
            // Triangle takes up entire width    
            width = screenWidth;
            height = sin60 * screenWidth;
            x = 0;
            y = screenHeight - height;
        } else {
            // Triangle takes up entire height
            width = screenHeight / sin60;
            height = screenHeight;
            x = (screenWidth - width) / 2;
            y = 0;           
        }

        p1x = x + (width / 2);
        p1y = y;
        p2y = y + height;
        p3y = y + height;
        p2x = x;  
        p3x = x + width;

        return new triangle({x : p1x, y: p1y}, {x : p2x, y: p2y}, {x : p3x, y: p3y});
    };

    function createTriangles(triangles) {
        allTriangles = [];
        triangles.slice().map(function (triangle) {
            var newTriangles = generateTriangles(triangle);
            newTriangles.map(function (val) {
                fillTriangle(val);
                allTriangles.push(val);
            });
        });
        return allTriangles;
    };

    function calculateMiddle(point1, point2) {
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
        }
    };

    function iterator(n) {
	  for (var i = 0; i < n; i++) {
	    createTriangles(allTriangles);
	  }

	  for (var i = 0; i < allTriangles.length; i++) {
	    fillTriangle(allTriangles[i]);
	  }
	}

    var canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext("2d");
    var count = 8;

    document.getElementById('increment').onclick = function () {
        if (count === 9) {
           count = 4; 
        }
        count = count + 1;
        allTriangles = [];
        //console.log('iteration :' + count);
        createTriangles(defaultTriangles);
        iterator(count);
    };

    document.getElementById('decrement').onclick = function () {
        if (count > -1) {
            count = count - 1;
        }
        count = count;
        allTriangles = [];
  		createTriangles(defaultTriangles);
  		iterator(count);
    };

    var zoomIntensity = 0.2;
    var scale = 1;
    var originx = 0;
    var originy = 0;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var visibleWidth = width;
    var visibleHeight = height;

canvas.onmousewheel = function (event){
    event.preventDefault();
    // Get mouse offset.
    var mousex = event.clientX - canvas.offsetLeft;
    var mousey = event.clientY - canvas.offsetTop;
    // Normalize wheel to +1 or -1.
    var wheel = event.wheelDelta/120;

    // Compute zoom factor.
    var zoom = Math.exp(wheel*zoomIntensity);
    
    // Translate so the visible origin is at the context's origin.
    context.translate(originx, originy);
  
    // Compute the new visible origin. Originally the mouse is at a
    // distance mouse/scale from the corner, we want the point under
    // the mouse to remain in the same place after the zoom, but this
    // is at mouse/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    originx -= mousex/(scale*zoom) - mousex/scale;
    originy -= mousey/(scale*zoom) - mousey/scale;
    
    // Scale it (centered around the origin due to the trasnslate above).
    context.scale(zoom, zoom);
    // Offset the visible origin to it's proper position.
    context.translate(-originx, -originy);

    // Update scale and others.
    scale *= zoom;
    visibleWidth = width / scale;
    visibleHeight = height / scale;
    calculateInitialTriangleStartPoint();
    iterator(2);
}

    // document.getElementById("myCanvas").addEventListener("wheel", myFunction);
    // 	function myFunction(initialTriangle) {
    // 		//console.log(defaultTriangles[0]);
    // 		var mousex = event.clientX - canvas.offsetLeft;
    // 		count = count + 1;
    // }

    // $(window).on("mousewheel DOMMouseScroll", function (e) {
    //     count += 1;
    //     console.log(count);
    //     iterator(count);
    // });

    //this is to create the initial triangle to fill the allTriangles array
    // createTriangles(defaultTriangles);
    // fillTriangle(defaultTriangles[0]);

	function _loadInitialSierpinski() {
	  	allTriangles = createTriangles(defaultTriangles);
	  	iterator(count);
	}

	_loadInitialSierpinski();
	console.log(allTriangles.length);


})();
