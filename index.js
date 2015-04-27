var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    redis = require('redis');

var app = express();

// APPROACH 1: Using environment variables created by Docker
// var client = redis.createClient(
// 	process.env.REDIS_PORT_6379_TCP_PORT,
//   	process.env.REDIS_PORT_6379_TCP_ADDR
// );

// APPROACH 2: Using host entries created by Docker in /etc/hosts
// (RECOMMENDED)

var nodedb2 = '172.17.0.2';
var client = redis.createClient(6379, 'nodedb2');

var redisport = process.env.NODEDB2_PORT_6379_TCP_PORT;
var redisaddr = process.env.NODEDB2_PORT_6379_TCP_ADDR;
var redisproto = process.env.NODEDB2_PORT_6379_TCP_PROTO;
var redisurl = process.env.NODEDB2_PORT;

var db2name = process.env.NODEDB2_NAME;

/*
Need to research how the environment variable of the source container (redis) is exposedin the target container node. It appears to be following a format of <allias>_ENV_<name> which might be
nodedb2_ENV_<not sure about this>
*/
// var db2url = process.env.DB2_PORT_6379_TCP;
// var db2proto = process.env.DB2_PORT_6379_PROTO;
// var db2port = process.env.DB2_PORT_6379_PORT;
// var db2addr = process.env.DB2_PORT_6379_ADDR;


// INSPECT THE etc/hosts file on Node Container

fs.readFile('/etc/hosts', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
    }
  console.log('THIS IS etc/hosts on Node Container');
  console.log(data);
  });

client.on('connect', function() {
    console.log('REDIS IS NOW connected');
    });

app.get('/', function(req, res, next) {
  client.incr('counter', function(err, counter) {
    if(err) return next(err);
    res.send('This page has been viewed ' + counter + ' times!');
  });
});

app.set('port', process.env.PORT || 8080);

http.createServer(app).listen(app.get('port'), function() {
  console.log('THIS IS VERSION 7');
  console.log('Node Container is listening ' + process.env.PORT);
  console.log('IN NODE CONTAINER >>>>>>');
  console.log('REDIS LIVE ON ' + redisaddr + ':' + redisport);
  console.log('REDIS PROTOCAL is ' + redisproto);
  console.log('REDIS FIRST URL PORT IS  ' + redisurl);
  console.log('From REDIS CONTAINER >>>>>>');
  // console.log('DB2 LIVE ON ' + db2addr + ':' + db2port);
  // console.log('and PROTOCAL is ' + db2proto);
  // console.log('and FIRST URL PORT IS  ' + db2url);
  console.log('and NAME IS  ' + db2name);

});
