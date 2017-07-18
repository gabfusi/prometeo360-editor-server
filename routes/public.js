"use strict";

const Error = require("modules/Errors");
const MovieService = require("modules/MovieService");
const config = require("config");

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('home');
  });


  app.get('/user/:userId', function (req, res) {
    let userId = req.params.userId;

    res.render('user-movie-list', {
      "userId": userId
    });
  });


  app.get('/movie/:userId/:movieId', function (req, res) {
    let userId = req.params.userId;
    let movieId = req.params.movieId;
      let movieService;

      try {
          movieService = new MovieService(userId, true);
      } catch (e) {
          // user not found
          return res.render('404');
      }


      movieService.getIfExists(movieId, (movie) => {

          if (!movie) {
              // movie not found
              console.error("movie not found");
              return res.render('404');
          }

          res.render('user-movie-single', {
              layout: false,
              "userId": userId,
              "title" : movie.name,
              "url" : req.protocol + '://' + req.get('host') + req.originalUrl,
              "movie" : JSON.stringify(movie)
          });

      })

  });

  app.get('/embed/:userId/:movieId', function (req, res) {
    let userId = req.params.userId;
    let movieId = req.params.movieId;
    let movieService;

    try {
      movieService = new MovieService(userId, true);
    } catch (e) {
      // user not found
      return res.render('404');
    }


    movieService.getIfExists(movieId, (movie) => {

      if (!movie) {
        // movie not found
        console.error("movie not found");
        return res.render('404');
      }

      res.render('user-movie-embed', {
        layout: false,
        "userId": userId,
        "title" : movie.name,
        "movie" : JSON.stringify(movie)
      });

    })

  });

};