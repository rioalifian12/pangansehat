'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail_Transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Detail_Transaksi.init({
    transaksiId: DataTypes.INTEGER,
    merk: DataTypes.STRING,
    jumlahSampel: DataTypes.INTEGER,
    jenisSampel: DataTypes.ENUM('makanan ringan', 'makanan berat', 'minuman cair', 'minuman serbuk'),
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Detail_Transaksi',
  });
  return Detail_Transaksi;
};