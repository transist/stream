var cluster = require('cluster')
  , express = require('express')
  ,      io = require('socket.io')
  ,     app = express.createServer()
  ,      io = io.listen(app);

  var NODE_ENV = global.process.env.NODE_ENV || 'development';
  var PORT = global.process.env.PORT || 8888;

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.cookieParser());
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.get('/', function(request, response) {
  response.send('Hello PubSub!');
});

app.get('/post.json', function(request, response) {
  io.sockets.in(request.query.channel).emit(request.query.event_name, request.query.message);
  response.send({'message_sent': true});
})

app.post('/batch.json', function(request, response) {
  console.log(request.body)
  for (channel in request.body.channels) {
    console.log(request.body.channels[channel])
    io.sockets.in(request.body.channels[channel]).emit(request.body.event_name, request.body.message);
  }
  response.send({'message_sent': true});
})

app.get('/ping', function(request, response) {
  res.writeHead( 200, {'Content-Type': 'text/plain'} );
  res.end( "pong" );
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


if (!module.parent) {
  if (NODE_ENV !== 'development') {
    sys.inspect(cluster);
    cluster(app)
      .use(cluster.logger('logs'))
      .use(cluster.stats())
      .use(cluster.pidfiles('pids'))
      .use(cluster.cli())
      // .use(cluster.repl(8080))
      .listen(app.set("listening_port"))
  } else {
    app.listen(app.set("listening_port"))
  }
}