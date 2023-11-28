"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("layanans", [
      {
        namaLayanan: "Analisis Kadar Karbohidrat",
        deskripsi: "Analisis Kadar Karbohidrat lorem ipsum",
        harga: "150000",
      },
      {
        namaLayanan: "Analisis Kadar Protein",
        deskripsi: "Analisis Kadar Protein lorem ipsum",
        harga: "185000",
      },
      {
        namaLayanan: "Analisis Kadar Air",
        deskripsi: "Analisis Kadar Air lorem ipsum",
        harga: "21000",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("layanans", {}, null);
  },
};
