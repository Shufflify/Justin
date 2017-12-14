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
  const queryAsync = 
  connection.connect();
  should = should();

  it('should have a populated playlists table', () => {
    connection.query('SELECT * FROM playlists', playlists => {
      playlists.should.exist;
    });
  });

  it('should have a populated songs table', () => {
    connection.query('SELECT * FROM songs', songs => {
      songs.should.exist;
    });
  });
  it('should have a populated users/playlist table', () => {
    connection.query('SELECT * FROM joinUserPlaylist', table => {
      table.should.exist;
    });
  });
  it('should have a populated songs/playlist table', () => {
    connection.query('SELECT * FROM songPlaylistJoin', table => {
      table.should.exist;
    });
  });

});