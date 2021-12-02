const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")))

var connections = [];

io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + " joined the conversation");
        connections.push({
            key:   socket.id,
            value: username
        })
    });
    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " left the conversation");
        connections = connections.filter(x => x.key != socket.id);
    });
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
    socket.on('disconnect', function() {
        var user = connections.find(x => x.key == socket.id);
        if(user) {
            socket.broadcast.emit("update", user.value + " left the conversation");
            connections = connections.filter(x => x.key != socket.id);
        }
    });
});

server.listen(5000);