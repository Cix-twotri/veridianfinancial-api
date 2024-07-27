import express from "express";
import { db } from "../connect.js";

const router = express.Router();

router.get('/:branchId/count', (req, res) => {
  const branchId = req.params.branchId;

  const q = "SELECT COUNT(*) as totalUsers FROM users WHERE branchId = ?";

  db.query(q, [branchId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    const totalUsers = result[0].totalUsers;
    return res.status(200).json({ totalUsers });
  });
});

export default router;
