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

var active_users = 0

io.sockets.on('connection', function (socket) {
  active_users = active_users + 1;
  io.sockets.in('/global_stats').emit('new_stats',  JSON.stringify({"num_active_users": active_users}));
  
  socket.on('join_room', function (data) {
    socket.join(data)
  });
  socket.on('new_user_message', function (data) {
    socket.broadcast.emit('new_user_message', data);
  });
  socket.on('disconnect', function () {
    active_users = active_users - 1;
    io.sockets.in('/global_stats').emit('new_stats',  JSON.stringify({"num_active_users": active_users}));
    console.log('disconnect')
  });
});


app.listen(parseInt(process.env.PORT || 9999));