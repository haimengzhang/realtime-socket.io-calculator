// hold the actual socket server
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors')
const port = process.env.PORT || 8000
// const index = require("./routes/index");

const app = express();
app.use(cors())

// app.use(index);
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(express.static(__dirname + '/../build'))

const server = http.createServer(app); //listen for socket connection

const io = socketIo(server,  {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "*", //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
}); // initialize a new instance by passing in the server object
// io.origins((origin, callback) => {
//     if (origin !== 'https://realtime-socketio-calculator.herokuapp.com/') {
//         return callback('origin not allowed', false);
//     }
//     callback(null, true);
//   });

app.use(express.static(__dirname + '/../build'))

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