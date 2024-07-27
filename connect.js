import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "sql10.freesqldatabase.com",
  user: "sql10721950",
  password: "ngMCJSfNzJ",
  database: "divinehelpfarmers",
  authPlugins: {
    mysql_native_password: 'deprecated',
  },
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database!');
  }
});