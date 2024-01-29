"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJSON() {
      return {
        ...this.get(),
        jumlahSampel: undefined,
        fotoSampel: undefined,
        jenisSampel: undefined,
        merk: undefined,
        responseMidtrans: undefined,
        layananId: undefined,
      };
    }
  }
  Transaksi.init(
    {
      orderId: DataTypes.STRING,
      metodePengiriman: DataTypes.ENUM("jasa kirim", "mendatangi laboratorium"),
      jumlahSampel: DataTypes.INTEGER,
      fotoSampel: DataTypes.STRING,
      jenisSampel: DataTypes.ENUM(
        "makanan ringan",
        "makanan berat",
        "minuman cair",
        "minuman serbuk"
      ),
      merk: DataTypes.STRING,
      statusBayar: DataTypes.ENUM("belum lunas", "lunas"),
      statusTransaksi: DataTypes.ENUM("proses", "selesai", "gagal"),
      responseMidtrans: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      layananId: DataTypes.INTEGER,
      totalHarga: DataTypes.INTEGER,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaksi",
    }
  );
  return Transaksi;
};
