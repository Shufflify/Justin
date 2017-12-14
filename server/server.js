const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db/index.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* TODO:
 * IMPLEMENT A WAY TO BALANCE OUT THE LOAD THROUGH MULTIPLE SERVERS
*/


app.get('/playlist/:id', (req, res) => {
  const query = 
  `
  SELECT name, id FROM playlists
    WHERE id IN (SELECT playlistId FROM joinUserPlaylist
    WHERE userId='${req.params.id}') 
  `;
  let connection;

  db.then(conn => {
    connection = conn;

    return connection.query(query);
  })
    .then( data => {
      res.json(data);
    });

});

app.get('/*', (req, res) => {
  res.send('hello world');
});





app.listen(process.env.port || 3000);