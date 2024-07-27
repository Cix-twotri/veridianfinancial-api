// api/routes/onlineUsers.js
import express from "express";
import { getOnlineUsers, onlineUsers } from "../controllers/onlineUser.js";

const router = express.Router();

router.get("/", getOnlineUsers);

export default router;