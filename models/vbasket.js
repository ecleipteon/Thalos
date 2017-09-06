
module.exports = function(sequelize, Sequelize) {

  var Basket = sequelize.define('basket', {
    basket_id : {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      unique: true
    },
    description: {
      type: Sequelize.TEXT
    },
    ownership: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
      references : {
        model:'users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'

    },
    public: {
      type: Sequelize.TEXT
    }

  });


    return Basket;
}
