// config file
var hostname = "http://" + window.location.hostname;
var port = location.port;
var jsonhost = hostname;
var jsonport = 3000;

var config = {
    files: hostname + ":" + port,
    db: jsonhost + ":" + jsonport
};
