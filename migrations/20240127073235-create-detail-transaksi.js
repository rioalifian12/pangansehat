'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Detail_Transaksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaksiId: {
        type: Sequelize.INTEGER
      },
      merk: {
        type: Sequelize.STRING
      },
      jumlahSampel: {
        type: Sequelize.INTEGER
      },
      jenisSampel: {
        type: Sequelize.ENUM('makanan ringan', 'makanan berat', 'minuman cair', 'minuman serbuk')
      },
      harga: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Detail_Transaksis');
  }
};