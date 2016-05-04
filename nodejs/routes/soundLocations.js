var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('soundLocationDB', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'soundLocationDB' database");
        db.collection('soundLocationDB', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'soundLocationDB' collection doesn't exist. Creating it with sample data...");
                db.createCollection('soundLocationDB');
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving soundLocation GeoLocation: ' + id);
    db.collection('soundLocationDB', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('soundLocationDB', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addSoundLocation = function(req, res) {
    var soundLocation = req.body;
    console.log('Adding soundLocation: ' + JSON.stringify(soundLocation));
    db.collection('soundLocationDB', function(err, collection) {
        collection.insert(soundLocation, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.send(result[0]);
            }
        });
    });
}

exports.deleteSoundLocation = function(req, res) {
    var id = req.params.id;
    console.log('Deleting soundLocation: ' + id);
    db.collection('soundLocationDB', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.deleteAll = function(req, res) {
    console.log('Deleting All');
    db.collection('soundLocationDB', function(err, collection) {
        collection.remove({}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

