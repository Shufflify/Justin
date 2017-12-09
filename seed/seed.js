// ==================================
// IMPORT MODULES
// ==================================

const faker = require('faker/locale/en');
const shortid = require('shortid');
const mysql = require('promise-mysql');

// ======================================
// CREATE DATABASE/TABLES AND RESET TABLE
// ======================================
const dropDB = 'DROP DATABASE Playlist';
const createDB = 'CREATE DATABASE Playlist';
const useDB = 'USE Playlist';

const createPlaylist = 
  `CREATE TABLE playlists(
    id INT PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(255)
  )`;

const createJoinTable = 
  `CREATE TABLE joinUserPlaylist(
    userId VARCHAR(255),
    playlistId INT NOT NULL,
    FOREIGN KEY(playlistId) REFERENCES playlists(id)
  )`;

// ==============================
// POPULATE PLAYLISTS
// ==============================
const insertPlaylist = 'INSERT INTO playlists (name) VALUES (?)';

// ==============================
// POPULATE JOIN TABLE
// ==============================
const getId = '(SELECT id FROM playlists WHERE name=?)';
const insertIntoJoin = `INSERT INTO joinUserPlaylist (userId, playlistId) VALUES (?, ${getId})`;

// ==============================
// INSTANTIATE CONNECTION
// ==============================
let connection;

mysql.createConnection({
  user: 'root',
  password: 'justin',
})
  .then(conn => {
    connection = conn;
    return connection.query(dropDB);
  })
  .then(() => connection.query(createDB))
  .then(() => connection.query(useDB))
  .then(() => connection.query(createPlaylist))
  .then(() => connection.query(createJoinTable))
  .then(() => {
    for (let i = 0; i < 100; i++) {
      let name = faker.lorem.words();
      connection.query(insertPlaylist, name)
        .then(() => connection.query(insertIntoJoin, [shortid.generate(), name]));
    }

    console.log('Seeding complete. Feel free to exit out with Ctrl/Command + C.');
  });