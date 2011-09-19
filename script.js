
/*

	Clifford Attractors
	Andy Green
	http://andygrn.co.uk
	September 2011

*/

var canvas,
	pen,
	pixels;

function init()
{
	
	canvas = document.getElementById('canvas');
	
	canvas.style.position = 'absolute';
	canvas.style.top = 0;
	canvas.style.left = 0;
	
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
	
	pen = canvas.getContext('2d');
	pixels = pen.createImageData(canvas.width, canvas.height);
	
	prepareDraw();
	document.querySelector('#attract').addEventListener('click', prepareDraw, false);
	document.querySelector('#save').addEventListener('click', saveCanvas, false);
	document.body.addEventListener('keypress', prepareDraw, false);

}

function prepareDraw()
{

	var sliders = document.querySelectorAll('#controls input'),
		params = [];
	
	for (var i = 0; i < sliders.length; ++i )
	{
	
		params[i] = (Math.floor(sliders[i].value * 10)) / 10;
	
	}
	
	clearCanvas();
	
	drawAttractor(params[0], params[1], params[2], params[3], params[4], params[5]);
	
	console.info('a:', params[0], ' b:', params[1], ' c:', params[2], ' d:', params[3]);

}

function drawAttractor(a, b, c, d, scale, opacity)
{
	
	var	x, // Mathematical coordinates in the attractor formulae
		y,
		xp = 0, // Holds previous loop's values of x and y
		yp = 0,
		xc, // Canvas pixel coordinates translated from x and y
		yc,
		pixel, // Index in the pixel array corresponding to [xc, yc]
		cw2 = Math.floor(canvas.width / 2), // Used for centering, saves on calculations
		ch2 = Math.floor(canvas.height / 2);
	
	for ( var i = 0; i < 500000; ++i )
	{
	
		x = Math.sin(a * yp) + (c * Math.cos(a * xp)); // The attractor formulae
		y = Math.sin(b * xp) + (d * Math.cos(b * yp));
		
		xc = Math.floor(x * scale) + cw2; // Turn x and y into valid canvas coordinates, and centre them
		yc = Math.floor(y * scale) + ch2;
		
		pixel = ((canvas.width * yc) + xc) * 4; // Turn the coordinate into an imageData array index
		// Width * y coordinate to get the row, then add the x coordinate to get the column
		// Multiply by 4 because each pixel takes up 4 array indexes (r, g, b, a)
		
		if ( pixels.data[pixel + 3] < 255 ) // [pixel] is the pixel's red channel value, so [pixel + 3] is the alpha channel value
		{
		
			pixels.data[pixel + 3] += opacity; // Build up colour on overlaps to give a transparent effect to the attractor shape (the pixels are already black by default)
		
		}
		
		xp = x; // Save the current values of x and y before the loop starts again
		yp = y;
	
	}
	
	pen.putImageData(pixels, 0, 0); // Draw the pixel array to the canvas

}

function clearCanvas()
{
	
	pen.clearRect(0, 0, canvas.width, canvas.height);
	pixels = pen.createImageData(canvas.width, canvas.height);

}

function saveCanvas()
{

	var image_data = canvas.toDataURL('image/png');
	
//	image_data = image_data.replace('image/png', 'application/octet-stream');
	
	document.location.href = image_data;

}

function resizeCanvas()
{
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

}
