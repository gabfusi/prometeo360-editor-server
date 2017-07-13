"use strict";

const async = require('async');
const fsx = require('fs-extra')
const path = require('path');
const DatabaseService = require('./DatabaseService.js');
const diff = require('deep-diff').diff;
const videosPath = path.join(__dirname, '..', 'uploads', 'videos');

const MovieService = function (user_id, readonly) {

  this.db = new DatabaseService(user_id, 'movies', readonly);

  /**
   *
   * @param movie_id
   * @param callback
   */
  this.getIfExists = (movie_id, callback) => {

    this.db.get(movie_id, (err, movie) => {

      if (err) {
        return callback(false);
      }

      callback(movie);
    });

  };

  /**
   *
   * @param movie
   * @param callback
   */
  this.add = (movie, callback) => {

    this.db.insert(movie.id, movie, function (err, body) {
      if (callback) callback(err, movie.id);
    });

  }

  /**
   *
   * @param movie
   * @param callback
   */
  this.update = (movie, callback) => {

    this.db.update(movie.id, movie, function (err, body) {
      if (callback) callback(err, movie.id);
    });

  }

  /**
   * Validate a movie
   * @param movie
   */
  this.validate = (movie) => {

    if (!movie) {
      throw new Error("Impossibile salvare il filmato.");
    }

    // controllo che il filmato sia ben formattato (è un controllo minimale, andrebbe esteso)
    if (typeof movie.name === 'undefined' || typeof movie.scenes === 'undefined' || typeof movie.id === 'undefined') {
      throw new Error("Formato non riconosciuto.");
    }

    if (!movie.name.length) {
      throw new Error("Specifica un nome per questo filmato.");
    }

  }

  /**
   *
   * @param movie1
   * @param movie2
   * @returns {*|{value, enumerable}}
   */
  this.getMoviesDiff = (movie1, movie2) => {
    return diff(movie1, movie2);
  }

  /**
   * extract videos from movie
   * @param movie
   * @returns {Array}
   */
  this.getVideos = (movie) => {

    let videos = [];

    for (let i in movie.scenes) {
      if (typeof movie.scenes[i].video === "string") {
        videos.push(movie.scenes[i].video);
      }
    }

    return videos;
  }

  /**
   *
   * @param movie1
   * @param movie2
   */
  this.getVideosDiff = (movie1, movie2) => {

    const videos1 = this.getVideos(movie1);
    const videos2 = this.getVideos(movie2);

    const removed = videos1.filter((item) => {
      return videos2.indexOf(item) < 0; // se non è presente in movie2 è stato rimosso
    });

    const added = videos2.filter((item) => {
      return videos1.indexOf(item) < 0;  // se non è presente in movie1 è stato aggiunto
    });

    return {
      added: added,
      removed: removed
    };
  }

  /**
   *
   * @param videos
   * @param callback
   */
  this.getNonExistingVideoFiles = (videos, callback) => {

    const nonExisting = [];

    async.eachSeries(videos, function (filename, cbk) {
      const video = path.join(videosPath, filename);
      fsx.pathExists(video, function (err, exists) {
        console.log(video, exists);
        if (!exists) nonExisting.push(filename);
        cbk();
      });
    }, function () {
      callback(nonExisting)
    })

  }

};

module.exports = MovieService;