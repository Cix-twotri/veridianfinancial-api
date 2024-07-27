import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getCardsByUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    const q = "SELECT * FROM cards WHERE userId = ?";

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  });
};

export const getCardsByUserOrder = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const userId = userInfo.id;
    const q = "SELECT * FROM cards WHERE userId = ? ORDER BY createdAt DESC LIMIT 1"; // Assuming 'createdAt' is your timestamp column

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  });
};