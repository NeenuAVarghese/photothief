/*
 * NodeJS server to provide API for uploading image 
 * Module required: express and multer
 *
 * Will attempt to provide static serving of files as well
 *
 * Used code example from multer documentation:
 * https://github.com/expressjs/multer
 *
 */

"use strict";

// Configuration variables
// port: is the port that this server will listen on
// staticHtml: the path of where to serve static files
// uploadDir: the relative directory to store upload photos
// photoPrefix: the prefix name for the uploaded photo
// formField: the input name of the field specify the type="file"
// route: the route name that this application will expose
var pt = {
    port: 8000,
    staticHtml: "./",
    uploadDir: "./photos",
    photoPrefix: "ptimg-",
    formField: "photo",
    route: "/ptupload"
};

// Initialize the module requirement
var express = require("express");
var multer = require("multer");
var app = express();

// Setup multer storage
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // Set the upload location as the photos subdirectory
        callback(null, pt.uploadDir);
    },
    filename: function (req, file, callback) {
        // Split the original file name to get the file extension
        var parts = file.originalname.split(".");
        var extension = parts[parts.length - 1];
        var filename = pt.photoPrefix + Date.now() + "." + extension;
        // Pass the filename back
        callback(null, filename);
    }
}); // end setup multer storage


// Configure a function to limit file type to jpeg only
var jpeg = function (req, file, callback) {
    if (file.mimetype.split("/")[1] === "jpeg") {
        // It's good
        callback(null, true);
    } else {
        // Not a jpeg file
        var error = new Error("Only accept jpeg image");
        error.file = file;
        callback(error);
    }
}; // end setup file filtering 


// Configure the upload middleware using multer to accept a single
// upload at a time via the field name "photo"
var mdUpload = multer({storage: storage, fileFilter: jpeg});


// Configure express middlewares
//
// Configure static file serving at the current file location
app.use(express.static(pt.staticHtml));

// Configure upload middleware
app.use(mdUpload.single(pt.formField));

// Configure express error handling
app.use(function (err, req, res, next) {
    var result = {};
    
    // Build error JSON result
    result.status = "error";
    result.message = err.message;
    if (err.hasOwnProperty("field")) {
        result.message += ". Got " + err.field;
        result.message += " while expecting " + pt.formField;
    }

    if (err.hasOwnProperty("file")) {
        result.message +=". Got " + err.file.mimetype.split("/")[0];
    }

    // Send the result back to user
    res.status(501).json(result).end();

    // Console log it
    console.log(err.message);

});

// Expose the upload Web Service API to user
app.post(pt.route, function (req, res) {
    var result = {};

    // If the form type not form-data
    if (!req.is("multipart/form-data")) {
        result.status = "error";
        result.message = "Invalid upload form encode type";
        result.message += ". Expect enctype: multipart/form-data";
        res.status(501).json(result).end();
        return;
    }

    if (req.hasOwnProperty("file")) {
        // Multer has process the file
        result.originalname = req.file.originalname;
        result.filename = req.file.filename;
        result.path = req.file.path;
        result.size = req.file.size;
        // Split the filename to get the middle part which is Date.now()
        // ptimg-xxx.jpg
        result.created = result.filename.split(".")[0].split("-")[1];
    }

    // Handle other multer errors
    mdUpload.single("photo")(req, res, function (err) {
        if (err) {
            result.status = "error";
            result.message = "File upload error encountered";
            res.status(501);
        } else {
            result.status = "success";
            result.message = "File upload success";
            res.status(200);
        }
        // Send the json result back
        res.json(result).end();
    });

    // Log the request to console
    console.log("Receive upload request on: " + req.url);
    
});


// Run the server.
app.listen(pt.port);
console.log("Server running on port: " + pt.port);

