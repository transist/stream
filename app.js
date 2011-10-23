var express = require('express')
  ,      io = require('socket.io')
  ,     app = express.createServer()
  ,      io = io.listen(app);

app.get('/', function(request, response) {
  response.send('Hello PubSub!');
});

app.get('/post.json', function(request, response) {
  io.sockets.in(request.query.channel).emit(request.query.event_name, request.query.message);
  response.send({'message_sent': true});
})

io.sockets.on('connection', function (socket) {
  socket.on('join_room', function (data) {
    socket.join(data)
  });
  socket.on('new_user_message', function (data) {
    socket.broadcast.emit('new_user_message', data);
  });
  socket.on('disconnect', function () {
    console.log('disconnect')
  });
});

app.listen(parseInt(process.env.PORT || 9999));