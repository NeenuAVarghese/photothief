# photothief
Instruction to test the latest project:

1.  git pull the project

2.  Ensure that the entire photothief folder is download to virtual machine

3.  cd photothief

4.  Use npm to install the dependencies which has been setup in the package.json file
        npm install

5.  step 4 should create a folder called: node_modules in photothief

6.  run the server as below.  Server will start on port 8000 by default:
        node ./server/ptserver.js

7.  This server should handle static file as well so you do not need to start SimpleHTTPServer
    If you get error that server can't start because port is used, stop the SimpleHTTPServer

8.  Run the json-server:
        json-server ./jsondb/db.json

9.  Unit test upload using upload.html.  Upon complete the request, the server will response
    with a json message of either error or success.  This should allow us to proceed with 
    handling it in ajax success call or error call
        http://localhost:8000/upload.html

10. File will upload to photothief/photos.  After upload, check the photos directory for file
    file format is ptimg-xxx.jpg where xxx is the current date in seconds (Date.now() )

11. Need to integrate it into the upload modal
