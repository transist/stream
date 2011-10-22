var express = require('express'),
    io = require('socket.io')
   app = express.createServer()
  , io = io.listen(app)
  , nicknames = {};

io.sockets.on('connection', function (socket) {
  socket.on('user message', function (msg) {
    socket.broadcast.emit('user message', socket.username, msg);
  });

  socket.on('username', function (nick, fn) {
    if (nicknames[nick]) {
      fn(true);
    } else {
      fn(false);
      nicknames[nick] = socket.nickname = nick;
      socket.broadcast.emit('announcement', nick + ' connected');
      io.sockets.emit('nicknames', nicknames);
    }
  });

  socket.on('disconnect', function () {
    if (!socket.username) return;

    delete nicknames[socket.nickname];
    socket.broadcast.emit('announcement', socket.username + ' disconnected');
    socket.broadcast.emit('nicknames', nicknames);
  });
});


app.listen(parseInt(process.env.PORT || 9999));