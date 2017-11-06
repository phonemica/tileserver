var express = require("express"),
	app = express(),
	MBTiles = require('mbtiles');
var mbtilesLocation = 'tilesets/xyy3.mbtiles';
new MBTiles(mbtilesLocation, function(err, mbtiles) {
	if (err) throw err;
	app.get('/:z/:x/:y', function(req, res) {
		mbtiles.getTile(req.params['z'], req.params['x'], req.params['y'], function(err, tile, headers) {
			if (err) {
				res.status(404).send('Tile rendering error: ' + err + '\n');
			} else {
				res.header("Content-Type", "image/png")
				res.send(tile);
			}
		});
	});
});

app.listen(4000);
