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
      socket.emit('file-uploaded', { filename: filename });
      console.log('file sent', filename);
    });

    console.log('Uploading video... ' + filename);
    stream.pipe(fs.createWriteStream(filepath));
  });

});

console.log('Plain socket.io server started at port 3002');