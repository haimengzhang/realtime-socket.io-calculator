// hold the actual socket server
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 8000
// const index = require("./routes/index");

const app = express();
// app.use(index);
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(express.static(__dirname + '/../build'))

const server = http.createServer(app); //listen for socket connection

const io = socketIo(server); // initialize a new instance by passing in the server object

app.use(express.static(__dirname + '/../../build'))

let historyData = []
io.on('connection', function (socket) {
    console.log('a user just connected')
    io.emit('history fetched', historyData)
    socket.on('new-calculation', (data) => {
        console.log('Sever received one calculation: ', data)
        if (historyData.length == 10) {
            historyData.shift()
            historyData.push(data)
        } else {
            historyData.push(data)
        }
        console.log('Merged History data is: ', historyData)
        io.emit('new-remote-calculation', historyData)
    })
    socket.on('disconnect', () => console.log('Client disconnected.'))

})

app.listen(port, () => {
    console.log("Connected to port:" + port);
})