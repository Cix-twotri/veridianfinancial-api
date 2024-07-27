import express from "express";
import { db } from "../connect.js";

const router = express.Router();

router.get("/", (req, res) => {
  const q = `
    SELECT 
  b.id, b.name, b.chairManWoman, b.sec, b.vic, b.created, b.location, b.img,
  u1.profilePic AS chairManWomanImg,
  u2.profilePic AS secImg,
  u3.profilePic AS vicImg,
  COUNT(u1.id) + COUNT(u2.id) + COUNT(u3.id) AS totalUsers
FROM branch b
LEFT JOIN users u1 ON b.chairManWoman = u1.name
LEFT JOIN users u2 ON b.sec = u2.name
LEFT JOIN users u3 ON b.vic = u3.name
GROUP BY b.id, b.name, b.chairManWoman, b.sec, b.vic, b.created, b.location, b.img, u1.profilePic, u2.profilePic, u3.profilePic;
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

router.get("/:branchId/totalUsers", (req, res) => {
  const branchId = req.params.branchId;
  const q = "SELECT COUNT(*) AS totalUsers FROM users WHERE branchId = ?";
  db.query(q, [branchId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
});

export default router;
