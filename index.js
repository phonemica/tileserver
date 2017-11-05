var express = require("express"),
	app = express(),
	MBTiles = require('mbtiles'),
	p = require("path"),
	fs = require('fs');
var tilesDir = "./";
var port = 4400;

function getContentType(t) {
	var header = {};
	header["Access-Control-Allow-Origin"] = "*";
	header["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
	if (t === "png") {
		header["Content-Type"] = "image/png";
	}
	if (t === "jpg") {
		header["Content-Type"] = "image/jpeg";
	}
	if (t === "pbf") {
		header["Content-Type"] = "application/x-protobuf";
		header["Content-Encoding"] = "gzip";
	}
	return header;
}
app.get('/:s/:z/:x/:y.:t', function(req, res) {
	new MBTiles(p.join(tilesDir, req.params.s + '.mbtiles'), function(err, mbtiles) {
		mbtiles.getTile(req.params.z, req.params.x, req.params.y, function(err_, tile, headers) {
			if (err_) {
				var buf = new Buffer(BLANK_PNG, 'base64');
				res.set({
					"Content-Type": "image/png",
					"Access-Control-Allow-Origin": '*',
					"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
				});
				res.status(200).send(buf);
			} else {
				res.set(getContentType(req.params.t));
				res.send(tile);
			}
		});
		if (err) console.log("error opening database");
	});
});
console.log('Tileserver running on port ' + port);
app.listen(port);

function Pad(num, zoom, type) {
	var padding = ((zoom > 17 && type == "R") || (zoom > 18 && type == "C")) ? 5 : 4;
	while (num.length < padding) {
		num = "0" + num;
	}
	return type + num;
}
var BLANK_PNG = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALMw9IgAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4wLjEyQwRr7AAAAZpJREFUeF7t0CEBAAAMhMD1L/0ztIAzeG5yDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBaDaBa8gHbA2oPDvK8padyAAAAAElFTkSuQmCC";
