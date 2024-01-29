require("dotenv").config();

const Validator = require("fastest-validator");
const models = require("../models");

// GET data transaksi by id
async function show(req, res) {
  try {
    const id = req.params.id;

    // get data transaksi by id
    const transaksi = await models.Transaksi.findByPk(id);
    if (!transaksi) throw new Error("Transaksi tidak ditemukan");

    // set variable transaksi id
    const transaksiID = transaksi.id;

    // get data detail transaksi by transaksiID
    const detailTransaksi = await models.Detail_Transaksi.findAll({
      where: {
        transaksiId: transaksiID,
      },
    });

    // data dari detail transaksi di mapping menggunakan promise all untuk mendapatkan data detail layanan
    const listDetailTransaksi = await Promise.all(
      detailTransaksi.map(async (item) => {
        const id = item.id;
        const detailLayanan = await models.Detail_Layanan.findAll({
          include: {
            model: models.Layanan,
            as: "layanan",
          },
          where: {
            detailTransaksiId: id,
          },
        });

        return {
          detail_transaksi: {
            ...item.dataValues,
            layanan: detailLayanan,
          },
        };
      })
    );

    res.status(200).json({
      transaksi,
      detail: listDetailTransaksi,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
      error: error,
    });
  }
}

// GET semua data transaksi
async function index(req, res) {
  try {
    const transaksi = await models.Transaksi.findAll();

    res.status(200).json({
      transaksi: transaksi,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
      error: error.message,
    });
  }
}

// Notifikasi pembayaran midtrans
async function notif(req, res) {
  try {
    const orderId = req.body.order_id;
    const statusBayar =
      req.body.transaction_status == "settlement" ? "lunas" : "belum lunas";
    const transaksi = await models.Transaksi.update(
      { statusBayar: statusBayar },
      {
        where: { orderId },
      }
    );
    res.status(200).json({
      message: "Berhasil ubah status bayar!",
      transaksi: transaksi,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan!",
      error: error.message,
    });
  }
}

// UPDATE data transaksi
function update(req, res) {
  const id = req.params.id;
  const updatedTransaksi = {
    statusTransaksi: req.body.status_transaksi,
  };

  const schema = {
    statusTransaksi: { type: "string", optional: false, max: "30" },
  };

  const v = new Validator();
  const validationResponse = v.validate(updatedTransaksi, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: validationResponse,
    });
  }

  models.Transaksi.update(updatedTransaksi, {
    where: { id: id },
  })
    .then((result) => {
      res.status(200).json({
        message: "Transaksi berhasil di update!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
        error: error,
      });
    });
}

module.exports = {
  show: show,
  index: index,
  notif: notif,
  update: update,
};
