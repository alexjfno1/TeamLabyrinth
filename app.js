var express = require("express");
var app = express();
var server = require("http").Server();
var io = require("socket.io")(server);

app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));

app.get("/", function(req, res) {
  res.sendfile(__dirname + "/views/index.html");
});

app.listen(process.env.port || 1234, function() {
  console.log("***** APP STARTED *****");
});
