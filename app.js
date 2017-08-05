var osmtogeojson = require('osmtogeojson');  // osmtogeojson library
var DOMParser = require('xmldom').DOMParser; // xmldom parser library
var path = process.cwd();                    // accessing the current directory   
var fs = require('fs');                      // fs library
var url = require('url');                    // url library
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var connect = require('connect');            // connect library
var serveStatic = require('serve-static');   // serve-static library

/* file url - contains coordinates of the bounding box of osm file to be download */
var new_file_url = 'http://api.openstreetmap.org/api/0.6/map?bbox=11.54,48.14,11.543,48.145';
// if you are using local-server for openstreetmap website
var new_file_url = 'http://localhost:3000/api/0.6/map?bbox=11.54,48.14,11.543,48.145';

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

/* A local sever folder is accessible via url: http://localhost:3030/. Where the osm and geojson files are downloaded */
connect().use(serveStatic(__dirname)).listen(3030, function(){
    console.log('Server running on 3030...');
});

/* url to download the geojson file */
// http://localhost:3030/map.geojson

/* remote device via chrome browser on the sever and android */
// https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server
// https://developers.google.com/web/tools/chrome-devtools/remote-debugging/