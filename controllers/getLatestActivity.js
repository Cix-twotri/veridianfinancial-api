import { db } from "../connect.js";

export const getLatestActivities = async (req, res) => {
  try {
    const query = `
    SELECT
    p.userId AS post_userId,
    p.createdAt AS post_createdAt,
    c.createdAt AS comment_createdAt,
    u.id AS user_id,
    u.name,
    u.profilePic
FROM
    posts AS p
INNER JOIN
    comments AS c ON p.id = c.postId
INNER JOIN
    users AS u ON p.userId = u.id
ORDER BY
    p.createdAt DESC
LIMIT 10;`;

    const [activities] = await db.promise().query(query);

    // Transform the data if needed (similar to your existing code)
    // ...

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching latest activities:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
