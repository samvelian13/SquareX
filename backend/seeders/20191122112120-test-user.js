'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return bcrypt.hash('12345678', 10)
        .then(password => {
          return queryInterface.bulkInsert('users', [{
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email@gmail.com',
            password
          }]);
        })
        .catch(err => {
          throw err;
        })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
