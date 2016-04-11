const AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1", //Sets the date region
    endpoint: "http://localhost:8000" // Endpoint for the data pool.
});

// Establish a new Dynamo session, will establish multi-user ability when time comes.
var dynamoDB = new AWS.DynamoDB();

// Instantiate the DB, and adjust the schema
/*var params = {
    TableName: "locationData",
    KeySchema: [{ // Main Key for DB collection
        AttributeName: "date",
        KeyType: "HASH"
    }, {
        AttributeName: "time",
        KeyType: "RANGE"
    }],
    AttributeDefinitions: [{
        AttributeName: "date",
        AttributeType: "S"
    }, {
        AttributeName: "time",
        AttributeType: "N"
    }, {
        AttributeName: "longitude",
        AttributeType: "N"
    }, {
        AttributeName: "latitude",
        AttributeType: "N"
    }, {
        AttributeName: "soundLevel",
        AttributeType: "N"
    }],
    /* Deigns the Read/Write speed for the DB
      Roughly R/W twenty Units per second. DB does not need to be power extensive yet.* /
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};
*/
tableName = "userData";

function createTable(tableName) {

    var params = {
        TableName: tableName,
        KeySchema: [{
            AttributeName: "userID", // Dictates where the data is coming from.
            KeyType: "HASH"
        }],
        AttributeDefinitions: [{
            AttributeName: "userID",
            AttributeType: "S"
        }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }

    };

    dynamoDB.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to Create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created Table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}

function putItem(newJSON) {

}

function dropTable(tableName) {
    var params = {
        TableName: tableName
    };

    dynamoDB.deleteTable(params, function(err, data) {
        if (err) {
            console.error("Unable to drop table ", JSON.stringify(err, null, 2));
        } else {
            console.log("Dropped Table", JSON.stringify(data, null, 2));
        }
    })
}

createTable("userData");