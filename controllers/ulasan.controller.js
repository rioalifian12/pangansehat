const Validator = require("fastest-validator");
const models = require("../models");

// POST data ulasan
function save(req, res) {
  const ulasan = {
    rate: req.body.rate,
    pesan: req.body.pesan,
    userId: req.userData.userId,
    transaksiId: req.body.transaksi_id,
  };

  const schema = {
    rate: { type: "number", optional: false },
    pesan: { type: "string", optional: false, max: "255" },
    transaksiId: { type: "number", optional: false },
  };

  const v = new Validator();
  const validationResponse = v.validate(ulasan, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: validationResponse,
    });
  }

  models.Transaksi.findByPk(req.body.transaksi_id).then((result) => {
    if (result !== null) {
      models.Ulasan.create(ulasan)
        .then((result) => {
          res.status(201).json({
            message: "Ulasan berhasil di buat!",
            ulasan: result,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Terjadi kesalahan!",
            error: error,
          });
        });
    } else {
      res.status(400).json({
        message: "Invalid Transaksi ID!",
      });
    }
  });
}

// GET data ulasan by id
function show(req, res) {
  const id = req.params.id;

  models.Ulasan.findByPk(id)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(500).json({
          message: "Ulasan tidak ditemukan!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
        error: error,
      });
    });
}

// GET semua data ulasan
function index(req, res) {
  models.Ulasan.findAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
        error: error,
      });
    });
}

// UPDATE data ulasan
function update(req, res) {
  const id = req.params.id;
  const updatedUlasan = {
    rate: req.body.rate,
    pesan: req.body.pesan,
    transaksiId: req.body.transaksi_id,
  };
  const userId = req.userData.userId;

  const schema = {
    rate: { type: "number", optional: false },
    pesan: { type: "string", optional: false, max: "255" },
    transaksiId: { type: "number", optional: false },
  };

  const v = new Validator();
  const validationResponse = v.validate(updatedUlasan, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: validationResponse,
    });
  }

  models.Transaksi.findByPk(req.body.transaksi_id).then((result) => {
    if (result !== null) {
      models.Ulasan.update(updatedUlasan, {
        where: { id: id, userId: userId },
      })
        .then((result) => {
          res.status(200).json({
            message: "Ulasan berhasil di update!",
            ulasan: updatedUlasan,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Terjadi kesalahan!",
            error: error,
          });
        });
    } else {
      res.status(400).json({
        message: "Invalid Transaksi ID!",
      });
    }
  });
}

module.exports = {
  save: save,
  show: show,
  index: index,
  update: update,
};
