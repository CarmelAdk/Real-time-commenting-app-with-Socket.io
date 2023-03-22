const express = require("express");
const app = express();

const http = require("http").Server(app);
const cors = require("cors");

const {createComment, listComments} = require("./lib/comments");


const PORT = 4000;
const CLIENT_ADDRESS = "http://127.0.0.1:5173"

app.use(cors());
app.use(express.json());



const io = require("socket.io")(http, {
  cors: {
    origin: CLIENT_ADDRESS,
  },
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

app.get("/users", (req, res) => {
  const {users} = require("./lib/users");
  res.json(users);
});

app.get("/comments", (req, res) => {
  res.json(listComments());
});

app.post("/comments", async (req, res) => {
  const comment = await createComment(req.body);
  io.emit("new-comment", { comment });
  res.json(comment);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});