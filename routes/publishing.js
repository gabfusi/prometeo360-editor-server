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

        console.log(moviesDiff, videosDiff)

        if (!moviesDiff) {
          return movieService.getNonExistingVideoFiles(newMovieVideos, (videos) => {
            res.json({
              "existing": true,
              "equals": false,
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

        return movieService.getNonExistingVideoFiles(newMovieVideos, (nonExistingVideos) => {

          movieService.getNonExistingVideoFiles(videosDiff.added, (videos) => {

            let all = videos.concat(nonExistingVideos);
            let toUpload = all.filter(function(elem, pos) { return all.indexOf(elem) === pos; });

            res.json({
              "existing": true,
              "equals": false,
              "videos": toUpload
            });
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