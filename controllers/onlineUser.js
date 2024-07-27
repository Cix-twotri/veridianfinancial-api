// api/controllers/onlineUser.js
export const onlineUsers = new Set();

export const getOnlineUsers = (req, res) => {
  res.json({ onlineUsers: Array.from(onlineUsers) });
};
