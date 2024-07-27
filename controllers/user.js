import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    // Check if user data exists
    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Destructure user data
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};

export const getRandomUsers = async (req, res) => {
  try {
    const query = 'SELECT id, name, profilePic FROM users ORDER BY RAND() LIMIT 10'; // Adjust the query as needed
    const [users] = await db.promise().query(query);

    // Transform the data to include only relevant fields
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      profilePic: user.profilePic,
    }));

    res.status(200).json(transformedUsers);
  } catch (error) {
    console.error('Error fetching random users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
