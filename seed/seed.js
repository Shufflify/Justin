// ==================================
// IMPORT MODULES
// ==================================

const faker = require('faker/locale/en');
const shortid = require('shortid');
const mysql = require('promise-mysql');
const Promise = require('bluebird');

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

const createSongTable = 
  `CREATE TABLE songs(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    artist VARCHAR(255),
    album VARCHAR(255),
    duration VARCHAR(255)
  )`;

const createSongPlaylistJoin =
  `CREATE TABLE songPlaylistJoin(
    songId INT NOT NULL,
    playlistId INT NOT NULL,
    addedAt VARCHAR(255),
    FOREIGN KEY(songId) REFERENCES songs(id),
    FOREIGN KEY(playlistId) REFERENCES playlists(id)
  )`;
// ==============================
// SET UP USERS
// ==============================

const users = [];

for (var i = 0; i < 10; i ++) {
  users.push(shortid.generate());
}
// ==============================
// POPULATE TABLES
// ==============================
const insertPlaylist = 'INSERT INTO playlists (name) VALUES (?)';
const insertSong = 'INSERT INTO songs (name, artist, album, duration) VALUES (?, ?, ?, ?)';
const getId = '(SELECT id FROM playlists WHERE name=?)';
const insertIntoJoin = `INSERT INTO joinUserPlaylist (userId, playlistId) VALUES (?, ${getId})`;

const useSongId = '(SELECT id FROM songs WHERE id=?)';
const usePlaylistId = '(SELECT id FROM playlists WHERE id=?)';
const insertIntoSPJoin = 
  `INSERT INTO songPlaylistJoin(songId, playlistId, addedAt)
    VALUES (${useSongId}, ${usePlaylistId}, ?);
  `;

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
  .then(() => connection.query(createSongTable))
  .then(() => connection.query(createSongPlaylistJoin))
  .then(() => {
    // populate playlists and playlist table
    const promises = [];

    for (let i = 0; i < 100; i++) {
      let name = faker.lorem.words();
      let user = users[Math.floor(Math.random() * users.length)];

      let promise = connection.query(insertPlaylist, name)
        .then(() => connection.query(insertIntoJoin, [user, name]));
      promises.push(promise);
    }

    // we do this to make sure all promises are fulfilled by the time we populate songs
    return Promise.all(promises);
  })
  .then(() => {
    //populate songs
    const promises = [];

    for (let i = 0; i < 1000; i++) {
      // name, artist, album, duration
      let name = faker.name.firstName() + ' ' + faker.name.lastName();
      let songData = [faker.lorem.words(), name, faker.lorem.word(), '3:00'];
      let promise = connection.query(insertSong, songData);

      promises.push(promise);
    }

    return Promise.all(promises);
  })
  .then(()=> connection.query('SELECT * FROM songs'))
  .then(songs => {
    const promises = [];

    for (song of songs) {
      let playlistIndex = Math.floor(Math.random() * 99) + 1;
      let promise = connection.query(insertIntoSPJoin, [song.id, playlistIndex, 'TODO']);

      promises.push(promise);
    }

    return Promise.all(promises);
  })
  .then(() => console.log('Seeding Complete'))
  .then(() => connection.end());