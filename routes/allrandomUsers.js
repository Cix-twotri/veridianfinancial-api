import express from "express";
import { getRandomUsers } from "../controllers/allRandomUser.js";

const router = express.Router();

router.get("/", getRandomUsers);

export default router;
