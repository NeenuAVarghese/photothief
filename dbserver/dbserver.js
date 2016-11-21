"use strict";

// DB deployment variables
// port: is the port that the database will listen on
// storage: the path to the db file

var db = {
    port: process.env.PORT || 3000,
    storage: "jsondb/db.json"
};

// Initialize the DB
var jsonServer = require('json-server');
var dbServer = jsonServer.create();

// Start the DB
dbServer.use(jsonServer.defaults());
dbServer.use(jsonServer.router(db.storage));
dbServer.listen(db.port, function () {
  console.log('JSON Server is running on port', db.port)
});
