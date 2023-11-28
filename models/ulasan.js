'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ulasan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ulasan.init({
    rate: DataTypes.INTEGER,
    pesan: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    transaksiId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ulasan',
  });
  return Ulasan;
};