var   io = require('socket.io')
  	, fs = require('fs')
	, connect = require('connect');


var app = connect().use(connect.static('public')).listen(3000);
var controller = io.listen(app);

function handler (req, res) {
  fs.readFile(__dirname + '/public/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

controller.sockets.on('connection', function (socket) {
  socket.emit('entrance', {message: 'Welcome to the chat room!'});

  socket.on('disconnect', function  () {
    controller.sockets.emit('exit', {message: 'A chatter has disconnected.'});
  });

  socket.on('mouseMove', function (mouseX, mouseY) {
    controller.sockets.emit('mouseMoved', mouseX, mouseY);
  });

  controller.sockets.emit('entrance', {message: 'A new chatter is online.'});
});