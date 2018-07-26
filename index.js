var url = require('url');
var mavlink = require('mavlink_common_v1.0');

console.log(url.parse(window.location.href));


mavlinkParser = new MAVLink();

mavlinkParser.on('message', function(message) {
    //console.log('Got a message of any type!');
    if (message.id != -1)
    {
      if(message.name in app.messages)
      {
        app.messages[message.name].push(message);
      }
      else
      {
        app.messages[message.name] = [message];
        app.message_types = Object.keys(app.messages);
      }
      //console.log(message);    

    }
});

var ondrop = function (ev) {
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
    

    console.log("vatata");
    console.log(app.messages);
  }


app = new Vue({
  el: '#vuewrapper',
  data: {
    message: 'Hello Vue!',
    messages: {},
    message_types: [], 
    process: ondrop,
    plot: function(message){console.log(message);},


    }
})
