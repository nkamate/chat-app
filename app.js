const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const UserModel = require('./src/model/UserModel');
const conversationModel = require('./src/model/ConverstationModel');


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

function updateUsers(socket) {
    let users = UserModel.find();
    socket.emit('updates', {type: 'users', data: users});
}

io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;

    updateUsers(socket);

    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(userId).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit("updates", {
                type: 'user-status-update',
                data: {
                    userId: userId,
                    connected: false
                }
            });
        }
    });

    socket.on(userId.toString(), msg => {
        console.log(`Message arrived ${JSON.stringify(msg)}`);
        conversationModel.add(parseInt(msg.fromUser), parseInt(msg.toUser), msg.msg).then(value => {
            console.log("ConversationModel added : " + value);
        });

        console.log(`Emitting message from:${msg.fromUser} to:${msg.toUser}`);
        io.emit(msg.toUser.toString(), msg);
        io.emit(msg.fromUser.toString(), msg);
    });

    socket.broadcast.emit("updates", {
        type: 'user-status-update',
        data: {
            userId: userId,
            connected: true
        }
    });

});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

app.get("/user", async (req, res) => {
    let users = await UserModel.find();
    return res.json({users})
});

app.get("/update-user", async (req, res) => {
    await UserModel.updateUser({id: req.query.id, username: req.query.name});
    io.emit('updates', {type: 'user-update', data: {id: req.query.id, username: req.query.name}});
    return res.json(req.params);
});


app.get('/find-user', async (req, resp) => {
    const username = req.query.id;
    let user = await UserModel.find({username: username});
    return resp.json(user);

});

app.get('/find-chat', async (req, resp) => {
    let chat = await conversationModel.find({fromUser: req.query.fromUser, toUser: req.query.toUser});
    return resp.json(chat);

});

app.get('/chat', async (req, res) => {
    const convos = await conversationModel.find({fromUser: req.query.fromUser, toUser: req.query.toUser});

    return res.json(convos);
});