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