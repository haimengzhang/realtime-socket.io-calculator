// hold the actual socket server
const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app)
const socketIo = require("socket.io");

const port = process.env.PORT || 8000
// app.use(index);
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

const io = socketIo(server,  {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "*:*"
        };
        res.writeHead(200, headers);
        console.log("the origin header is: ", headers["Access-Control-Allow-Origin"])
        console.log('The access conrol allow orgin headers is set to be request url')
        res.end();
    }
});

// io.origins((origin, callback) => {
//     if (origin !== 'https://realtime-socketio-calculator.herokuapp.com/') {
//         return callback('origin not allowed', false);
//     }
//     callback(null, true);
//   });

let historyData = []
io.on('connection', function (socket) {
    console.log('a user just connected')
    // socket.on('fetch request', ()=>{io.emit('history fetched', historyData)})
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

app.use(express.static(__dirname + '/../build'))
server.listen(port, () => {
    console.log("Connected to port:" + port);
})