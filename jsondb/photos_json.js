// Dynamically create database for the list of photos to see how it works
// Structure of the json created is as follow:
// {
//    photos: [
//      {id, src}
//    ]
// }
module.exports = function() {
    var db = { photos: [] };
    // Create 1000 users
    for (var i = 1; i < 73; i++) {
        var num = "" + i;
        var padding = "000"; // Padding of 3 digit
        var url = "photos/";
        // Pad left up to 3 slots
        url += padding.substring(0, padding.length - num.length) + num;
        // Add image type
        url += ".jpg";

        // Add the photo to database
        db.photos.push({ id: i, src: url });
  }
  return db;
};
