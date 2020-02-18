const app = require('../app');
const config = require('../config');

const server =  app.listen(config.port, onListening);

function onListening() {
  console.log(`Server listenning on port: ${config.port}!`);
}
