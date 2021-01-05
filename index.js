const server = require('./server');

try {
  server.start();
} catch (err) {
  console.log(err);
}