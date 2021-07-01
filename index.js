const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: [ "GET", "POST" ]
  }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Running');
});

io.on('connection', function(socket) {
  socket.on('send-username', function(username) {
      socket.emit("me", username);
      socket.join(username);
      console.log(username);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    //console.log(userToCall);
    socket.broadcast.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
