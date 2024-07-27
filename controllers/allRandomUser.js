import { db } from "../connect.js";

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