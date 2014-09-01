var express = require('express')
  , app = express()  
  , server = require('http').createServer(app)
  , path = require('path')
  , io = require('socket.io').listen(server)
  , spawn = require('child_process').spawn
  , omx = require('omxcontrol')
  , fs = require('fs');

// all environments
app.set('port', process.env.TEST_PORT || 8080);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(omx());
io.set('log level', 1);

function runShell(cmd, args, cb, end) {
  var spawn = require('child_process').spawn,
      child = spawn(cmd, args),
      me = this;
  child.stdout.on('data', function (buffer) { cb(me, buffer) });
  child.stdout.on('end', end);
}

function sendParseResults(ss)
{
  var input = fs.createReadStream('movie_db.txt');
  var remaining = '';
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      ss.emit('movie_entry',{ data: {id:line.split("|")[0].split(":")[1],
                                     actors:line.split("|")[1].split(":")[1],
                                     director:line.split("|")[2].split(":")[1],
                                     genre:line.split("|")[3].split(":")[1],
                                     img:line.split("|")[4].split(":")[1]+":"+line.split("|")[4].split(":")[2],
                                     length:line.split("|")[5].split(":")[1],
                                     path:line.split("|")[6].split(":")[1],
                                     plot:line.split("|")[7].split(":")[1],
                                     title:line.split("|")[8].split(":")[1].replace(/^\s+|\s+$/g, ''),
                                    }
                            });  
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      //console.log(remaining);
      ss.emit('movie_entry',{ data: {id:remaining.split("|")[0].split(":")[1],
                                     actors:remaining.split("|")[1].split(":")[1],
                                     director:remaining.split("|")[2].split(":")[1],
                                     genre:remaining.split("|")[3].split(":")[1],
                                     img:line.split("|")[4].split(":")[1]+":"+line.split("|")[4].split(":")[2],
                                     length:remaining.split("|")[5].split(":")[1],
                                     path:remaining.split("|")[6].split(":")[1],
                                     plot:remaining.split("|")[7].split(":")[1],
                                     title:remaining.split("|")[8].split(":")[1].replace(/^\s+|\s+$/g, ''),
                                    }
                            });  
    }
  });
}

//socket.emit('movie_entry',{ data: buffer });  


//Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/player', function (req, res) {
  res.sendfile(__dirname + '/public/player.html');
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var ss;
//Socket.io Server
io.sockets.on('connection', function (socket) {

 socket.on("remote_loading", function(data){
  //Save the screen socket
  ss = socket;
  var run_shell=new runShell('python',
                              ['../scripts/dirParser.py', '/home/fripe/Downloads'],                              
                              function (me, buffer) { 
                                me.stdout += buffer.toString();
                                console.log(me.stdout);
                              },
                              function () { 
                              sendParseResults(ss);
                              });
  console.log("remote is loading...");
 });

});
