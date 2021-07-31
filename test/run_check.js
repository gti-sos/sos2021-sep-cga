const newman = require('newman'); // require newman in your project
const app = require('../index');
const fs = require('fs');

fs.stat('olimpic-stats.db', function(err, stat) {
    if(err == null) {
        fs.copyFileSync("olimpic-stats.db", "olimpic-stats.db.bak");
    }
});

newman.run({
    collection: require('./sos2021-sep-cga v1.postman_collection'),
    reporters: 'cli'
}, function (err) {
	if (err) { throw err; }
    console.log('Collection run complete!');
    // Close server
    app.close();
    // Restore db
    fs.stat('olimpic-stats.db.bak', function(err, stat) {
        if(err == null) {
            fs.copyFileSync("olimpic-stats.db.bak", "olimpic-stats.db");
            fs.rmSync("olimpic-stats.db.bak");
        }
    });
});