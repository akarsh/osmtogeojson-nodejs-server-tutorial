[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
# osmtogeojson-nodejs-server-tutorial
Tutorial for osmtogeojson-nodejs-server.

## Table of Contents
- [Introduction](#introduction)
- [Tutorial](#tutorial)
- [Credits](#credits)

### Introduction
In this tutorial you will be able to learn how to download an osm file from the OpenStreetMap-website via api using wget and curl.

I created this tutorial because i faced some difficulties in implemntation of osmtogeojson nodejs library. As, the osm file has to be parsed using xmldom parser and then again using JSON.stringify to save the parsed file as GeoJSON.

### Tutorial
The library files are declared
```
var osmtogeojson = require('osmtogeojson');  // osmtogeojson library
var DOMParser = require('xmldom').DOMParser; // xmldom parser library
var path = process.cwd();                    // accessing the current directory
var fs = require('fs');                      // fs library
var url = require('url');                    // url library
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var connect = require('connect');            // connect library
var serveStatic = require('serve-static');   // serve-static library
```

You need to provide the boundingbox coordinates of the osm file to be downloaded from the osm api
```
/* file url - contains coordinates of the bounding box of osm file to be download */
var new_file_url = 'http://api.OpenStreetMap.org/api/0.6/map?bbox=11.54,48.14,11.543,48.145';
```
If you are using local-server of [OpenStreetMap-website](https://github.com/OpenStreetMap/OpenStreetMap-website). Then the new_file_url will be
```
var new_file_url = 'http://localhost:3000/api/0.6/map?bbox=11.54,48.14,11.543,48.145';
```

You can initially test your nodejs-sever for osmtogeojson by downloading the osm and GeoJSON file locally.
```
/* Converting and saving files locally */
// fs.readFile(path + "//testmap.osm", function(err, data)
// {
//     if(err)
//         console.log(err)
//     else
//     	var docNew = new DOMParser().parseFromString(data.toString());
//        	var newdocNew = osmtogeojson(docNew);
//         fs.writeFile(path + "//testmap.geojson", JSON.stringify(newdocNew), function(err)
// 		{
//     		if(err)
//        			console.log(err);
//     		else
//        		 	console.log('file is created');
// 		});
// });
```

Downloading the osm file via wget
```
/* download osm file using wget */
var download_file_wget = function(file_url) {
    // compose the wget command
    var wget = 'wget -O ' + '"' + path + '/map.osm' + '"' + ' ' + file_url;
    console.log(wget);
    // excute wget using child_process' exec function
    var child = exec(wget, function(err, stdout, stderr) {
        if (err)
          throw err;
        else
          console.log(' downloaded to ' + path);
    });
};

/* calling the  download_file_wget function*/
download_file_wget(new_file_url);
```

Downloading the osm file via curl
```
/* download osm file using curl */
var download_file_curl = function(file_url) {
    // create an instance of writable stream
    var file = fs.createWriteStream('' + path + '/map.geojson' + '');
    // execute curl using child_process' spawn function
    var curl = spawn('curl', [file_url]);
    // add a 'data' event listener for the spawn instance
    curl.stdout.on('data', function(data) {
      var docNew = new DOMParser().parseFromString(data.toString());
      var newdocNew = osmtogeojson(docNew);
      file.write(JSON.stringify(newdocNew));
    });
    // add an 'end' event listener to close the writeable stream
    curl.stdout.on('end', function(data) {
        file.end();
        console.log(' downloaded to ' + '' + path + '/map.geojson' + '');
    });
    // when the spawn child process exits, check if there were any errors and close the writeable stream
    curl.on('exit', function(code) {
        if (code != 0) {
            console.log('Failed: ' + code);
        }
    });
};

/* calling the  download_file_curl function*/
download_file_curl(new_file_url);
```

This creates a local-server that is accessible at port ```3030```
```
/* A local sever folder is accessible via url: http://localhost:3030/. Where the osm and GeoJSON files are downloaded */
connect().use(serveStatic(__dirname)).listen(3030, function(){
    console.log('Server running on 3030...');
});
```

You can test the GeoJSON file by accessing this url,
```
/* url to download the geojson file */
// http://localhost:3030/map.geojson

/* remote device via chrome browser on the sever and android */
// https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server
// https://developers.google.com/web/tools/chrome-devtools/remote-debugging/
```

### Credits
This project uses Open Source components. You can find the source code of their open source projects along with license information below. We acknowledge and are grateful to these developers for their contributions to open source.
* Project: [osmtogeojson](https://github.com/tyrasd/osmtogeojson)

  Author: [6+ contributors](https://github.com/tyrasd/osmtogeojson/graphs/contributors)

  License: [MIT](https://github.com/tyrasd/osmtogeojson/blob/gh-pages/LICENSE)

* Project: [Connect](https://github.com/tyrasd/osmtogeojson)

  Author: [100+ contributors](https://github.com/senchalabs/connect/graphs/contributors)

  License: [MIT](https://github.com/senchalabs/connect/blob/master/LICENSE)
