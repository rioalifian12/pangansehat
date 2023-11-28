const Validator = require("fastest-validator");
const models = require("../models");

const midtransClient = require("midtrans-client");
// Create Core API instance
const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: "SB-Mid-server-SwcIptoozpDvmkZ1AsAqUDLE",
  clientKey: "SB-Mid-client-cSfWORNAAEn-PV8K",
});

// POST data transaksi
function charge(req, res) {
  coreApi
    .charge(req.body)
    .then((chargeResponse) => {
      const dataTransaksi = {
        orderId: chargeResponse.order_id,
        metodePengiriman: req.body.metode_pengiriman,
        jumlahSampel: req.body.jumlah_sampel,
        fotoSampel: req.body.foto_sampel,
        jenisSampel: req.body.jenis_sampel,
        merk: req.body.merk,
        responseMidtrans: JSON.stringify(chargeResponse),
        userId: req.userData.userId,
        layananId: req.body.layanan_id,
      };

      models.Layanan.findByPk(req.body.layanan_id).then((result) => {
        if (result !== null) {
          models.Transaksi.create(dataTransaksi)
            .then((result) => {
              res.status(201).json({
                message: "Transaksi berhasil di buat!",
                result: result,
              });
            })
            .catch((error) => {
              res.status(500).json({
                message: "Terjadi kesalahan!",
                error: error.message,
              });
            });
        } else {
          res.status(400).json({
            message: "Invalid Layanan ID!",
          });
        }
      });
    })
    .catch((e) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
        error: e.message,
      });
    });
}

// GET data transaksi by id
// function show(req, res) {
//   const id = req.params.id;

//   models.Transaksi.findByPk(id)
//     .then((result) => {
//       if (result) {
//         res.status(200).json(result);
//       } else {
//         res.status(500).json({
//           message: "Transaksi tidak ditemukan!",
//         });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Terjadi kesalahan!",
//         error: error,
//       });
//     });
// }

// GET semua data transaksi
function index(req, res) {
  models.Transaksi.findAll()
    .then((result) => {
      const tampilData = result.map((item) => {
        return {
          orderId: item.orderId,
          metodePengiriman: item.metodePengiriman,
          jumlahSampel: item.jumlahSampel,
          fotoSampel: item.fotoSampel,
          jenisSampel: item.jenisSampel,
          merk: item.merk,
          statusTransaksi: item.statusTransaksi,
          responseMidtrans: {
            totalBayar: JSON.parse(item.responseMidtrans).gross_amount,
            kadaluarsaPembayaran: JSON.parse(item.responseMidtrans).expiry_time,
            noVa: JSON.parse(item.responseMidtrans).va_numbers,
            noVa1: JSON.parse(item.responseMidtrans).permata_va_number,
            statusBayar: JSON.parse(item.responseMidtrans).transaction_status,
          },
          userId: item.userId,
          layananId: item.layananId,
        };
      });
      res.status(200).json({
        result: tampilData,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
        error: error.message,
      });
    });
}

// Notifikasi pembayaran midtrans
function notif(req, res) {
  coreApi.transaction.status(req.params.orderId).then((statusResponse) => {
    const responseMidtrans = JSON.stringify(statusResponse);
    models.Transaksi.update(
      { responseMidtrans: responseMidtrans },
      {
        where: { orderId: req.params.orderId },
      }
    )
      .then((result) => {
        res.status(200).json({
          message: "Berhasil ubah status bayar!",
          result: responseMidtrans,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Terjadi kesalahan!",
          error: error.message,
        });
      });
  });
}

// UPDATE data transaksi
function update(req, res) {
  const id = req.params.id;
  const updatedTransaksi = {
    statusTransaksi: req.body.status_transaksi,
  };
  const userId = req.userData.userId;

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
    where: { id: id, userId: userId },
  })
    .then((result) => {
      res.status(200).json({
        message: "Transaksi berhasil di update!",
        transaksi: updatedTransaksi,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
        error: error,
      });
    });
}

// DELETE data transaksi
// function destroy(req, res) {
//   const id = req.params.id;
//   const userId = req.userData.userId;

//   models.Transaksi.destroy({
//     where: { id: id, userId: userId },
//   })
//     .then((result) => {
//       res.status(200).json({
//         message: "Transaksi berhasil di hapus!",
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Terjadi kesalahan!",
//         error: error,
//       });
//     });
// }

module.exports = {
  charge: charge,
  // show: show,
  index: index,
  notif: notif,
  update: update,
  // destroy: destroy,
};
