// ==================================
// DB STUFF
// ==================================
// TODO:
// MIGRATE THIS TO A DB FOLDER AND FILE AFTER CONFIGURING SEED;
const faker = require('faker/locale/en');
const shortid = require('shortid');
const Promise = require('bluebird');
const Sequelize = require('sequelize');

const db = new Sequelize({
  database: 'Playlists',
  username: 'root',
  password: 'justin12',
  dialect: 'mysql',
});

const Playlist = db.define('playlists', {
  name: Sequelize.STRING,
}, {
  timestamps: false,
});

const JoinTable = db.define('userPlaylistJoins', {
  playlistId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  userId: Sequelize.STRING,
}, {
  timestamps: false,
});

JoinTable.belongsTo(Playlist);

JoinTable.sync();
Playlist.sync();

// ==========================
// SEED ACTION
// ==========================

/*
 * We're going to start off with an array of promises since saving a Playlist is asynchronous
 * Let's keep in mind that Sequelize's promise suite is bluebird
 * Once we have an array of promises we use Promise.all to have an array of the payloads once
 * the promises are resolved
 * With the payload, we can now map out array and create our join tables
 *
 * Ideally since this is simply a seed file, for simplicity's sake we will use Promise.all
 * It's more efficient to just get a payload of one promise and go straight to creating the join table
 * As soon as we create our playlist
 * ^^Things to keep in mind when working on production code + live data
 */
const playlistDataPromise = [];

for (var i = 0; i < 10; i++) {
  let name = faker.lorem.words();
  playlistDataPromise.push(Playlist.build({ name }).save());
}


Promise.all(playlistDataPromise)
  .then(data => data.map(({ dataValues }) => dataValues ))
  .then(data => data.map(playlist => JoinTable.build({
    playlistId: playlist.id,
    userId: shortid.generate(),
  }).save()))
  .then(Promise.all)
  .then(data => data.map(({ dataValues }) => dataValues ))
  .then(console.log);