const app = require("express")();
require("dotenv").config();
const cors = require("cors");
const { getQuestion } = require("./api/services");
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    allowedHeaders: "*",
    exposedHeaders: "*",
    preflightContinue: true,
  })
);
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.status(200).send("wooooo brother");
});

app.get("/api-test", async (req, res) => {
  const data = await getQuestion();
  if (!data) {
    res.status(400).send("yikes");
  }
  res.status(200).send(data);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  socket.on("NEW_MESSAGE", (data) => {
    io.in(roomId).emit("NEW_MESSAGE", data);
  });

  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

http.listen(4500, () => {
  console.log("listening on *:4500");
});
