const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const server = require("http").createServer(app);
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { query } = require("express");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: [ "GET", "POST" ]
  }
});

const PORT = process.env.PORT || 5000;

app.get("/app", (req, res) => {
  res.send("Running");
});

const db = mysql.createConnection({
  user: "sql6424032",
  host: "sql6.freemysqlhosting.net",
  password: "p9SvilQpGD",
  database: "sql6424032",
});

app.get("/register", (req, res) => {
  if (req.session.user) {
    res.send({ registered: true, user: req.session.user });
  } else {
    res.send({ registered: false });
  }
});

app.post("/register", (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "SELECT * FROM users WHERE username = ?;",
      username,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }

        if (result.length > 0) {
          res.send({ message: "Username already in use, please try something different" });
        } 
        else if (username==="" || name==="" || password==="") {
          res.send({ message: "Please fill all the details" });
        } 
        else {
          console.log(username, name, hash)
          db.query(
          "INSERT INTO users (name, username, password) VALUES (?,?,?)",
          [name, username, hash],
          (err, result) => {
            console.log(err);
          });
          res.send({ message: "Registered Successfully! Login to enter the app" });
        }
    });
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
          } 
          else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } 
      else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});


io.on("connection", function(socket) {
  socket.on("send-username", function(username) {
    socket.emit("me", username);
    socket.join(username);
    console.log(username);
  });

  socket.on("callDecline", () => {
    socket.broadcast.emit("callDecline");
  });

  socket.on("callEnded", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    socket.broadcast.to(userToCall).emit("callUser", { signal: signalData, from: from, name: name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", { signal: data.signal });
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
