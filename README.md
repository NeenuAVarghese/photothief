Software Installation
The application was built using the following software and libraries.  All licenses and credits for these libraries are to the respected owners.  We only use them to incorporate it into the application.
Software LibrariesLicense DetailsOfficial WebsiteBootstrap CSS FrameworkMIT licensehttp://getbootstrap.com/Clipboard libraryMIT licensehttps://github.com/zenorocha/clipboard.jsCollageplus libraryMIT, GPLv2 Licensehttp://collageplus.edlea.com/Font-awesomeMIT, SIL OFL 1.1http://fontawesome.io/Material Design Lite icons, fontsSIF OFL 1.1https://github.com/FortAwesome/Font-AwesomeJQueryMIT licensehttp://jquery.com/OwlcarouselMIT licensehttp://www.owlcarousel.owlgraphic.com/UnderscoreMIT licensehttp://underscorejs.org/ExpressMIT licensehttps://github.com/expressjsMulterMIT licensehttps://github.com/expressjs/multer
a. Prerequisites
Before installing the application, we need to setup a basic environment to get started.  Below is the list of preinstalled software that must exists for our application to work.
1. NodeJS 
2. Json-server module 
3. Git
4. npm
The above can be satisfied quite easily using the predefined vagrant node-box provided in this course.
b. Installation
To install the application perform the following steps:
1. Create or pick a directory of your choice to host the application  i.e. ~/test
	mkdir test
2. Clone our application from github
cd test
git clone https://github.com/NeenuAVarghese/photothief.git
3. Install the node dependencies modules required for this application (Express and Multer)
	cd photothief
	npm install
Upon finish installation, you should have the following directory structures similar to the screenshot below.
Figure: After Installation Directory Structurec. Post Installation and Run the application
To use the demo data, we need to perform the following:

1. Git clone the demo photo files
git clone https://github.com/ddangcsu/photothief-demo.git
2. Extract and copy the demo photos into the photos subdirectory of photothief application
3. Start the node server that will assist us in accepting upload photos and also acting as a static file server.
      cd <path_to>/photothief
      node ./server/ptserver
Figure : Starting HTTP Server4. Open another ssh session and start the json server to host the database
	cd <path_to>/photothief
	json-server ./jsondb/db.json
Figure: Starting JSON Server      
5. Open the browser and connect to http://localhost:8000 to start using the application

