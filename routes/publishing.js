"use strict";

const path = require('path');
const config = require("config");
const Error = require("modules/Errors");
const MovieService = require("modules/MovieService");

module.exports = function (app) {

  /**
   * Video publish request
   */
  app.post('/api/movie/publish', (req, res, next) => {

    const data = req.body;
    const userId = data.userId;
    const newMovie = data.movie;

    const movieService = new MovieService(userId);

    try {
      movieService.validate(newMovie); // throws
    } catch (e) {
      return Error.sendMissingParametersResponse(res, e.message);
    }

    // exists?

    movieService.getIfExists(newMovie.id, function (existingMovie) {
      const newMovieVideos = movieService.getVideos(newMovie);

      if (existingMovie) {

        const moviesDiff = movieService.getMoviesDiff(existingMovie, newMovie);
        const videosDiff = movieService.getVideosDiff(existingMovie, newMovie);

        if (!moviesDiff) {
          return movieService.getNonExistingVideoFiles(newMovieVideos, (videos) => {
            res.json({
              "existing": true,
              "equals": true,
              "videos": videos
            });
          });
        }

        if (videosDiff.removed.length) {
          for (let i = 0; i < videosDiff.removed; i++) {
            fs.unlink(path.join(config.videosPath, videosDiff.removed[i]), (err) => {
              console.log("Deleting video... ", err)
            });
          }
        }

        movieService.update(newMovie);

        // TODO always check if videos exists on filesystem, than intersect with added videos if any

        return movieService.getNonExistingVideoFiles(videosDiff.added, (videos) => {
          res.json({
            "existing": true,
            "equals": false,
            "videos": videos
          });
        });
      }

      movieService.add(newMovie);

      return movieService.getNonExistingVideoFiles(newMovieVideos, (videos) => {
        res.json({
          "existing": false,
          "equals": false,
          "videos": videos
        });
      });
    })


  });


};