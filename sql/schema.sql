CREATE DATABASE Playlists;

USE Playlists;

CREATE TABLE playlists (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL
);

CREATE TABLE userPlaylistJoin (
	userId INT NOT NULL,
	playlistId INT NOT NULL,
	FOREIGN KEY(playlistId) REFERENCES playlists(id)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < sql/schema.sql
 *  to create the database and the tables.*/