const express = require("express")
const config = require('config')
const mongoose = require('mongoose')
const multer = require("multer");
const app = express()
const server = require('http').Server(app);

const io = require('socket.io')(server)


app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api', require('./routes/users.routes'))
app.use('/api', require('./routes/upload.routes'))
app.get('/chat', function (req, res) {
    res.sendFile(__dirname+'/chat.html')
})


const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        app.listen(PORT, () => console.log(`app has been started on port ${PORT}`))

    } catch (e) {
        console.log(`server error ${e.message}`)
        process.exit(1)
    }
}

connections = []
io.sockets.on('connection', function (socket) {
    console.log("Успешное соединение");
    // Добавление нового соединения в массив
    connections.push(socket);

    // Функция, которая срабатывает при отключении от сервера
    socket.on('disconnect', function(data) {
        // Удаления пользователя из массива
        connections.splice(connections.indexOf(socket), 1);
        console.log("Отключились");
    });

    // Функция получающая сообщение от какого-либо пользователя
    socket.on('send mess', function(data) {
        // Внутри функции мы передаем событие 'add mess',
        // которое будет вызвано у всех пользователей и у них добавиться новое сообщение
        io.sockets.emit('add mess', {mess: data.mess, name: data.name, className: data.className});
    });
})
start()

