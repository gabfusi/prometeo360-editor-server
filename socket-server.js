'use strict';

const io = require('socket.io')(3002);
const ss = require('socket.io-stream');
const fs = require('fs');
const path = require('path');

io.on('connection', function (socket) {
  console.log('client connected');

  ss(socket).on('upload-video', function (stream, data) {

    let filename = path.basename(data.name);
    let filepath = path.join(__dirname, 'uploads', 'videos', filename);

    stream.on('end', function () {
      console.log('file sent');
    });

    stream.pipe(fs.createWriteStream(filepath));
  });

});

console.log('Plain socket.io server started at port 3002');