const path = require('path');
const convict = require('convict');

const config = convict({
  env: {
    format: ['production', 'development'],
    default: 'development',
    arg: 'nodeEnv',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    arg: 'port',
    env: 'PORT'
  },
  db: {
    username: {
      doc: 'Database user name',
      format: '*',
      default: '',
      env: 'DB_UNAME'
    },
    password: {
      doc: 'Database password',
      format: '*',
      default: '',
      env: 'DB_PASS'
    },
    database: {
      doc: 'Database name',
      format: '*',
      default: '',
      env: 'DB_NAME_DWQQW'
    },
    host: {
      doc: 'Database host',
      format: '*',
      default: '127.0.0.1',
      env: 'DB_HOST'
    },
    dialect: {
      doc: 'Database dialect',
      format: ['mysql', 'postgres'],
      default: 'mysql',
      env: 'DB_DIALECT'
    },
  },
  appName: {
    doc: 'Name of the application',
    default: 'Coffee Shop',
    arg: 'appName',
    env: 'APP_NAME'
  },
  jwtSecret: {
    doc: "Secret key for JWT token generation and check",
    format: "String",
    default: "",
    sensitive: "true",
    env: 'JWT_SECRET'
  }
});

const env = config.get('env');

config.loadFile(path.join(__dirname, `environments/${env}.json`));

config.validate();

module.exports = config.getProperties();
