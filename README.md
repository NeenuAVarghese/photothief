#PhotoThief 

PhotoThief is a photo-sharing site where users can upload incriminating photos and generate a ransoms link that the users can send to the victims.  The application is created for entertainment purposes only and primarily use to demonstrate that such single-page web application can be written entirely with just HTML, CSS, and JavaScript technologies

![Main Screen](https://github.com/NeenuAVarghese/photothief/blob/master/screenshots/MainScreen.png)



###Software Installation

####Prerequisites
Before installing the application, we need to setup a basic environment to get started.  Below is the list of required preinstalled 
software:

1. NodeJS and update npm
2. Json-server module 
3. Git
The above can be satisfied quite easily using the predefined vagrant node-box provided in this course.  Additionally, an internet connection is needed to download the application from GitHub.

####Installation
To install the application perform the following steps:

1. Create or pick a directory of your choice to host the application  i.e. ~/test
`mkdir test`

2. Clone our application from github
    
    `cd test`

    `git clone https://github.com/NeenuAVarghese/photothief.git`

3. Clone the demo photo assets and unzip to photothief/photos folder
    
    `git clone https://github.com/ddangcsu/photothief-demo.git`

    `unzip ./photothief-demo/demo_photos.zip -d ./photothief`

    Note:  A sample JSON database provided in photothief/jsondb/db.json.

4. Install the node dependencies modules required (Express and Multer)
	  
    `cd photothief`

    `npm install`

    Upon finish installation, you should have the following directory structures similar to the screenshot below.

    ![Directory Structure](https://github.com/NeenuAVarghese/photothief/blob/master/screenshots/Directorystructure.png)

####Post Installation and Run the application
Since the two servers required for this application will be running on port 8000 and port 3000 respectively, please ensure that the environment has these two ports available.

1. Start the node server that will assist us in accepting upload photos and acting as a static file server.  
Note:  It is important to run the ptserver.js in the directory of photothief as it will serve static files from that directory.
    
    `cd ~/test/photothief`

    `node ./server/ptserver.js`
 
    ![HTTP Server] (https://github.com/NeenuAVarghese/photothief/blob/master/screenshots/startHTTPserver.png)

2. Open another ssh session and start the JSON server to host the database
	  
	  `cd ~/test/photothief`
	  
	  `json-server ./jsondb/db.json`

    ![JSON Server] (https://github.com/NeenuAVarghese/photothief/blob/master/screenshots/startJSONserver.png)

3. Open the browser and connect to http://localhost:8000 to start using the application
