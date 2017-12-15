let { should } = require('chai');
const mysql = require('mysql');
const Promise = require('bluebird');
const sqlobject = {
  user: 'root',
  password: 'justin',
  database: 'Playlist'
};



describe('Seeded Database', () => {
  let connection = mysql.createConnection(sqlobject);
  const queryAsync = Promise.promisify(connection.query.bind(connection));
  connection.connect();
  should = should();

  it('should have a populated playlists table', () => {
    queryAsync('SELECT * from playlists')
      .then(playlists => {
        playlists.should.exist;
      });
  });

  it('should have a populated songs table', () => {
    queryAsync('SELECT * FROM songs')
      .then(songs => {
        songs.should.exist;
      });
  });
  it('should have a populated users/playlist table', () => {
    queryAsync('SELECT * FROM joinUserPlaylist')
      .then(table => {
        table.should.exist;
      });
  });
  it('should have a populated songs/playlist table', () => {
    queryAsync('SELECT * FROM songPlaylistJoin')
      .then(table => {
        table.should.exist;
      });
  });

});

describe('Inputs/Outputs on server', () => {
  it('should render playlists');
});