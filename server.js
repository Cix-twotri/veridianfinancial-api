import express from "express";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import randomUsersRoutes from "./routes/allrandomUsers.js";
import friendssRoutes from "./routes/friends.js";
import onlineUsersRoutes from "./routes/onlineUsers.js";
import postRoutes from "./routes/posts.js";
import productRoutes from "./routes/products.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import latestactivityRoutes from "./routes/latestActivities.js";
import storiesRoutes from "./routes/stories.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import branchRoutes from "./routes/branch.js";
import categoriesRoutes from './routes/categories.js';
import headOfficeRoutes from "./routes/headOffice.js";
import followingRoutes from "./routes/following.js";
import branchCountRoutes from "./routes/branchCount.js";
import newMemberCounttRoutes from "./routes/newMemberCount.js";
import cardRoutes from "./routes/cards.js";

const app = express();
const JWT_SECRET = "secretkey";

const server = http.createServer(app);

const io = new SocketIoServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(express.static("../client/public/upload"));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/branches", branchRoutes);
app.use('/api/categories', categoriesRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/allrandomusers", randomUsersRoutes);
app.use("/api/latestactivity", latestactivityRoutes);
app.use("/api/online-users", onlineUsersRoutes);
app.use("/api/friends", friendssRoutes);
app.use("/api/headOffice", headOfficeRoutes);
app.use("/api/following", followingRoutes);
app.use("/api/branchCount", branchCountRoutes);
app.use("/api/newMemberCount", newMemberCounttRoutes);
app.use("/api/cards", cardRoutes);

const users = {}; // Map to store user IDs and socket IDs

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("authenticate", (token) => {
    try {
      const user = jwt.verify(token, JWT_SECRET);

      // Check if the user is already connected
      if (users[user.id]) {
        // Disconnect the old socket
        users[user.id].socket.disconnect();
      }

      // Add the user to the map
      users[user.id] = { socket, id: user.id, username: user.username };
      console.log(`Authenticated user ${user.username} connected`);

      // Notify other users about the new connection
      socket.broadcast.emit("user_connected", {
        userId: user.id,
        username: user.username,
      });
    } catch (err) {
      console.log("Authentication failed:", err);
      socket.disconnect();
    }
  });

  socket.on("send_message", (data) => {
    console.log(`Received message from ${data.username}: ${data.message}`);
    socket.broadcast.emit("receive_message", data);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId].socket.id === socket.id) {
        console.log(`User ${users[userId].username} disconnected`);
        delete users[userId]; // Remove user from the map
        socket.broadcast.emit("user_disconnected", { userId: userId });
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("API working!");
});
