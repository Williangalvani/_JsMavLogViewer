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

  }

var default_colors = ['#3366CC','#DC3912','#FF9900','#109618','#990099','#3B3EAC','#0099C6','#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300','#8B0707','#329262','#5574A6','#3B3EAC']

function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

var loadMessageType = function(type)
{
  console.log(app.messages[type]);
  var fields = app.messages[type][0].fieldnames.slice(1);
  console.log(fields);
  var msgs = app.messages[type];
  var datasets = [];
  for (var i=0; i<fields.length; i++)
  {
    datasets.push({
                          label: ''+fields[i],
                          backgroundColor: shadeColor2(default_colors[i],0.5),
                          borderColor: default_colors[i],
                          fill: false,
                          data: [],
                        });
  }

  console.log(datasets);
  for(msg in msgs){
      for (field in fields){
        datasets[field].data.push({x:msgs[msg].time_boot_ms, y: msgs[msg][fields[field]]})
      }
  }
  app.plotData = {
        datasets: datasets
      };
  app.plotOptions = {
        responsive: true,
        title: {
          display: true,
          text: 'Chart.js Time Point Data'
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Date'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'value'
            }
          }]
        }
      }
  app.shouldPlot = true;

}




Vue.component('line-chart', {
  extends: VueChartJs.Line,
  mounted () {
    this.renderChart(app.plotData, app.plotOptions);
  }
  
});



app = new Vue({
  el: '#vuewrapper',
  data: {
    message: 'Hello Vue!',
    messages: {},
    message_types: [], 
    process: ondrop,
    plot: loadMessageType,
    shouldPlot: false,
    plotData: {},
    plotOptions: {},


    }
})
