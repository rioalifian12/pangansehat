"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Detail_Layanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Layanan }) {
      // define association here
      this.belongsTo(Layanan, {
        foreignKey: "layananId",
        as: "layanan",
      });
    }

    toJSON() {
      const forNamaLayanan = this?.layanan?.namaLayanan
        ? this.layanan.namaLayanan
        : "";
      const forHargaLayanan = this?.layanan?.harga ? this.layanan.harga : 0;

      return {
        ...this.get(),
        layanan: undefined,
        namaLayanan: forNamaLayanan,
        hargaLayanan: forHargaLayanan,
      };
    }
  }
  Detail_Layanan.init(
    {
      detailTransaksiId: DataTypes.INTEGER,
      layananId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Detail_Layanan",
    }
  );
  return Detail_Layanan;
};
