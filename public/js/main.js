"use strict";

(function (undefined) {

  var page, movie;

  // on document ready
  document.addEventListener("DOMContentLoaded", onLoad);

  /**
   * On DOM ready
   */
  function onLoad() {

    if (typeof window._sharedData === 'undefined') {
      return;
    }

    page = window._sharedData.page;

    // "router"
    switch (page) {

      case 'embed':
      case 'single':
        movie = movie = window._sharedData.movie;
        initPlayer(movie);
        break;
    }
  }

  /**
   * initialize player
   * @param movie
   */
  function initPlayer(movie) {

    if(typeof window.PlayerVR === 'undefined') {
      console.error("Cannot find PlayerVR!");
      return;
    }

    var player = new PlayerVR(movie);
      window.pp = player;

  }

})();
