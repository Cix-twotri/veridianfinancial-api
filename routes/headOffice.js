import express from 'express';
import { db } from "../connect.js";

const router = express.Router();

// Fetch users by branchId
router.get('/:branchId', (req, res) => {
  const branchId = req.params.branchId;

  const q = "SELECT * FROM users WHERE branchId = ?";

  db.query(q, [branchId], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
});

export default router;