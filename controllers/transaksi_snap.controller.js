require("dotenv").config();
const db = require("../models");
const models = require("../models");

const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

async function transaksi_snap(req, res) {
  const t = await db.sequelize.transaction();
  try {
    const { body } = req;
    const orderId = body.order_id;
    const metodePengiriman = body.metode_pengiriman;
    const totalHarga = body.total_harga;
    const detailTransaksi = body.detail_transaksi;
    const userId = req.userData.userId;
    const nama = req.userData.nama;
    const email = req.userData.email;
    const noHp = req.userData.noHp;
    const alamat = req.userData.alamat;

    // input ke tabel transaksi
    const dataTransaksi = {
      orderId: orderId,
      statusTransaksi: "proses",
      metodePengiriman: metodePengiriman,
      userId: userId,
      totalHarga: totalHarga,
    };
    const transaksi = await models.Transaksi.create(dataTransaksi, {
      transaction: t,
    });
    const transaksiID = transaksi.id;

    // mapping 2 data => detail transaksi & detail layanan
    const dataDetailTransaksi = await Promise.all(
      detailTransaksi.map(async (item) => {
        const merk = item.merk;
        const jumlahSampel = item.jumlah_sampel;
        const jenisSampel = item.jenis_sampel;
        const harga = item.harga;

        // insert detail transaksi
        const dataCreateDetailTransaksi = {
          transaksiId: transaksiID,
          merk,
          jumlahSampel,
          jenisSampel,
          harga,
        };
        const createDetailTransaksi = await models.Detail_Transaksi.create(
          dataCreateDetailTransaksi,
          {
            transaction: t,
          }
        );
        const detailTransaksiID = createDetailTransaksi.id;

        // insert data layanan
        const listLayanan = item.layanan;
        const ids = await Promise.all(
          listLayanan.map(async (itemID) => {
            const layanan = await models.Layanan.findOne({
              where: {
                id: itemID,
              },
            });
            if (!layanan) return null; // return null if layanan not available in DB

            const dataCreateDetailLayanan = {
              detailTransaksiId: detailTransaksiID,
              layananId: layanan.id,
            };
            const createDetailLayanan = await models.Detail_Layanan.create(
              dataCreateDetailLayanan,
              {
                transaction: t,
              }
            );
            return createDetailLayanan;
          })
        );
        const idsLayanan = ids.filter((data) => {
          if (data) return data;
        });

        // final Detail Transaksi & Detail Layanan
        return {
          detail_transaksi: {
            ...createDetailTransaksi.dataValues,
            layanan: idsLayanan,
          },
        };
      })
    );

    // Midtrans
    const parameterMidtrans = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalHarga,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: nama,
        email: email,
        phone: noHp,
        address: alamat,
      },
    };

    const sendMidtrans = await snap.createTransaction(parameterMidtrans);
    const midtransToken = sendMidtrans.token;
    const fullMidtransUrl = process.env.MIDTRANS_URL_SANDBOX + midtransToken;
    transaksi.token = midtransToken;
    await transaksi.save({ transaction: t });

    // save to db
    await t.commit();

    res.status(200).json({
      transaksi: transaksi,
      data_detail_transaksi: dataDetailTransaksi,
      midtrans_url: fullMidtransUrl,
    });
  } catch (error) {
    // ROLBACK DB
    await t.rollback();
    return res.status(500).json({
      message: "Terjadi kesalahan!",
      error: error?.message ? error.message : "ERROR_",
    });
  }
}

module.exports = {
  transaksi_snap,
};
