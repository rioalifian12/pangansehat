"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transaksis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orderId: {
        type: Sequelize.STRING,
      },
      metodePengiriman: {
        type: Sequelize.ENUM("jasa kirim", "mendatangi laboratorium"),
      },
      jumlahSampel: {
        type: Sequelize.INTEGER,
      },
      fotoSampel: {
        type: Sequelize.STRING,
      },
      jenisSampel: {
        type: Sequelize.ENUM(
          "makanan ringan",
          "makanan berat",
          "minuman cair",
          "minuman serbuk"
        ),
      },
      merk: {
        type: Sequelize.STRING,
      },
      statusTransaksi: {
        type: Sequelize.ENUM("proses", "selesai"),
      },
      responseMidtrans: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      layananId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transaksis");
  },
};
