import { db } from "../connect.js";

export const getFriends = async (req, res) => {
  try {
    const query = 'SELECT id, name, profilePic FROM users ORDER BY name ASC'; // Fetch all users ordered by name
    const [users] = await db.promise().query(query);

    // Transform the data to include only relevant fields
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      profilePic: user.profilePic,
    }));

    res.status(200).json(transformedUsers);
  } catch (error) {
    console.error('Error fetching all users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};