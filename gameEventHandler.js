var handler = {};

handler.connection = function (socket){
    socket.emit('message', {'message': 'hello world'});
    socket.on("client_data", function(data){
        process.stdout.write(data.letter);
    })
}


module.exports = handler;
