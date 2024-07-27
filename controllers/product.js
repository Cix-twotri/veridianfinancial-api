import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getProducts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const q = `
      SELECT p.*, u.id AS usersId, u.name, u.profilePic
      FROM products AS p
      JOIN users AS u ON u.id = p.usersId
      LEFT JOIN relationships AS r ON p.usersId = r.followedUserId AND r.followerUserId = ?
      WHERE p.usersId = ? OR r.followerUserId = ?
      ORDER BY p.createdAt DESC
    `;

    console.log('Executing query with user ID:', userInfo.id);

    db.query(q, [userInfo.id, userInfo.id, userInfo.id], (err, data) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json("Something went wrong!");
      }
      console.log('Query result:', data); // Debug log
      return res.status(200).json(data);
    });
  });
};

export const addProduct = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      INSERT INTO products(
        \`desc\`, \`img\`, \`createdAt\`, \`usersId\`,
        \`productName\`, \`new\`, \`used\`, \`size\`, \`color\`, \`brand\`,
        \`price\`, \`category\`, \`location\`
      ) VALUES (?)
    `;

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.productName,
      req.body.new,
      req.body.used,
      req.body.size,
      req.body.color,
      req.body.brand,
      req.body.price,
      req.body.category,
      req.body.location
    ];

    console.log("Inserting product with values:", values); // Log values being inserted

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("Insert error:", err); // Log any insert errors
        return res.status(500).json(err);
      }
      console.log("Insert success:", data); // Log success
      return res.status(200).json("Product has been created.");
    });
  });
};

export const deleteProduct = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM products WHERE `id`=? AND `usersId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};
