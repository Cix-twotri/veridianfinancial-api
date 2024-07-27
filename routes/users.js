import express from "express";
import { getUser , updateUser, getRandomUsers} from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/randomUsers", getRandomUsers)


export default router