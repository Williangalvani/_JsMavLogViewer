var url = require('url');
var mavlink = require('mavlink_common_v1.0');
var winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ]
});

console.log(url.parse(window.location.href));

//mavlinkParser = new MAVLink(logger, 1, 50);
mavlinkParser = new MAVLink();

mavlinkParser.on('message', function(message) {
    //console.log('Got a message of any type!');
    if (message.id != -1)
    {
      console.log(message);    
    }
});



function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
        console.log(file);


        var reader = new FileReader();

        reader.onload = function(e) {
            var data = reader.result;
            var buffer = Buffer.from(data);
            console.log(buffer);
            mavlinkParser.pushBuffer(Buffer.from(data)); 
            mavlinkParser.parseBuffer(); 
            }
            //console.log(data);
        
        reader.readAsArrayBuffer(file);
        


      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      console.log(ev.dataTransfer.files[i]);
    }
  } 
  
  // Pass event to removeDragData for cleanup
  removeDragData(ev)
}

function dragOverHandler(ev) {
  console.log('File(s) in drop zone'); 

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function removeDragData(ev) {
  console.log('Removing drag data')

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    ev.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}


document.getElementById("drop_zone").ondrop=dropHandler;
document.getElementById("drop_zone").ondragover=dragOverHandler;
