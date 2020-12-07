const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const io = require('socket.io')(3001)
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('assets'))

app.get('/',(req,res)=>{
  res.render('homePage.ejs')
})

app.get('/meetNow', (req, res) => {
  // res.redirect(`/${uuidV4()}`)
  res.render('room', { roomId: `/${uuidV4()}` })
})

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

app.get('/:room', (req, res) => {
  // console.log(req.params.room);
  res.render(req.params.room)
  // res.render('room', { roomId: req.params.room })
})
const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

server.listen(process.env.PORT ||3000)