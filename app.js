var express = require('express'),
    io = require('socket.io')
   app = express.createServer()
  , io = io.listen(app)
  , nicknames = {};

  app.get('/', function(request, response) {
    response.send('Hello World!');
  });


io.sockets.on('connection', function (socket) {
  console.log('socket connection')
  // socket.on('user message', function (msg) {
  //   socket.broadcast.emit('user message', 'test', msg);
  // });
  // 
  // socket.on('news', function (nick, fn) {
  //   if (nicknames[nick]) {
  //     fn(true);
  //   } else {
  //     fn(false);
  //     nicknames[nick] = socket.nickname = nick;
  //     socket.broadcast.emit('announcement', nick + ' connected');
  //     io.sockets.emit('news', nicknames);
  //   }
  // });
  // 
  socket.on('new_user', function (data) {
    console.log(data)
    socket.broadcast.emit('new_user_message', 'test');
  });
  
  socket.on('new_user_message', function (data) {
    console.log(data)
    socket.broadcast.emit('new_user_message', 'test');
  });
  
  socket.on('disconnect', function () {
    console.log('disconnect')
  });
});


app.listen(parseInt(process.env.PORT || 9999));