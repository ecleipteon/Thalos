module.exports = function(sequelize, Sequelize) {
  var models = require('./');

  var User = sequelize.define('user', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        username: {
            type: Sequelize.TEXT
        },

        public_key: {
            type: Sequelize.TEXT
        },

        email: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        password: {
            type: Sequelize.STRING,
            allowNull: false
        },

        last_login: {
            type: Sequelize.DATE,
            defaultValue: null

        },

        basketcount: {
          type: Sequelize.INTEGER,
          defaultValue: '0'
        },

        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'inactive'
        },

        activation_token: {
          type: Sequelize.STRING,
          defaultValue: null
        },

        base: {
          type: Sequelize.TEXT,
          defaultValue: null
        },


    });

    User.associate = function(models) {
        User.hasMany(models.basket);
    }


    return User;
}
