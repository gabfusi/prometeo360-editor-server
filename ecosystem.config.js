"use strict";

const EXEC_MODE = "fork";
const MAX_MEMORY_RESTART = "1G";
const AUTORESTART = true;

module.exports = {

  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // Web Server for AngularJS Client
    {
      name: "StorageServer",
      script: "start.js",
      cwd: "./",
      exec_mode: EXEC_MODE,
      max_memory_restart: MAX_MEMORY_RESTART,
      autorestart: AUTORESTART
    }
  ]

};