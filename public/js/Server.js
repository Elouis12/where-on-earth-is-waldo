let socketServer = require('socket.io');



const ioConnection = new socketServer(3000);

ioConnection.on("connection", (socket)=>{


    socket.emit("hello", 'world');

    socket.or('howdy', (arg)=>{

        console.log(arg);
    })

})
