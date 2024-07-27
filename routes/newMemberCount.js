import express from "express";
import { db } from "../connect.js";

const router = express.Router();

router.get('/:branchId/newUsers', (req, res) => {
  const branchId = req.params.branchId;
  const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

  const q = `
    SELECT COUNT(*) as newUsersCount, MAX(createdAt) as latestUserTime
    FROM users 
    WHERE branchId = ? AND createdAt >= ?
  `;

  db.query(q, [branchId, oneYearAgo], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    const { newUsersCount, latestUserTime } = result[0];
    return res.status(200).json({ newUsersCount, latestUserTime });
  });
});

export default router;
