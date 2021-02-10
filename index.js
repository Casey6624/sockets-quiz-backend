const app = require("express")();
const cors = require("cors");
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
  res.sendFile(__dirname + "/index.html");
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
