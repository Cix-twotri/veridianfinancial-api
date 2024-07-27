import express from "express";
import { db } from "../connect.js";

const router = express.Router();

router.get("/followed/:followerUserId", (req, res) => {
  const followerUserId = req.params.followerUserId;
  // Updated query to join with the users table and select the profilePic
  const q = `
  SELECT u.profilePic, u.id AS userId, u.name
  FROM relationships r
  JOIN users u ON u.id = r.followedUserId
  WHERE r.followerUserId = ?
  `;

  db.query(q, [followerUserId], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
});
export default router;
