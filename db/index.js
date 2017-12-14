const mysql = require('promise-mysql');


module.exports = mysql.createConnection({
  user: 'root',
  password: 'justin',
  database: 'Playlist'
});
