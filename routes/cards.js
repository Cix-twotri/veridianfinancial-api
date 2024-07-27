import express from "express";
import { getCardsByUser, getCardsByUserOrder } from "../controllers/cards.js";

const router = express.Router();

router.get("/", getCardsByUser);
router.get("/recent", getCardsByUserOrder);

export default router;