const Validator = require("fastest-validator");
const models = require("../models");

// POST data layanan
function save(req, res) {
  const layanan = {
    namaLayanan: req.body.nama_layanan,
    deskripsi: req.body.deskripsi,
    metode: req.body.metode,
    harga: req.body.harga,
  };

  const schema = {
    namaLayanan: { type: "string", optional: false, max: "100" },
    deskripsi: { type: "string", optional: false, max: "255" },
    metode: { type: "string", optional: false, max: "30" },
    harga: { type: "number", optional: false },
  };

  const v = new Validator();
  const validationResponse = v.validate(layanan, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: validationResponse,
    });
  }

  models.Layanan.create(layanan)
    .then((result) => {
      res.status(201).json({
        message: "Layanan berhasil di buat!",
        layanan: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
        error: error,
      });
    });
}

// GET data layanan by id
// function show(req, res) {
//   const id = req.params.id;

//   models.Layanan.findByPk(id)
//     .then((result) => {
//       if (result) {
//         res.status(200).json(result);
//       } else {
//         res.status(500).json({
//           message: "Layanan tidak ditemukan!",
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

// GET semua data layanan
function index(req, res) {
  models.Layanan.findAll()
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

// UPDATE data layanan
function update(req, res) {
  const id = req.params.id;
  const updatedLayanan = {
    namaLayanan: req.body.nama_layanan,
    deskripsi: req.body.deskripsi,
    metode: req.body.metode,
    harga: req.body.harga,
  };

  const schema = {
    namaLayanan: { type: "string", optional: false, max: "100" },
    deskripsi: { type: "string", optional: false, max: "255" },
    metode: { type: "string", optional: false, max: "30" },
    harga: { type: "number", optional: false },
  };

  const v = new Validator();
  const validationResponse = v.validate(updatedLayanan, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: validationResponse,
    });
  }

  models.Layanan.update(updatedLayanan, {
    where: { id: id },
  })
    .then((result) => {
      res.status(200).json({
        message: "Layanan berhasil di update!",
        layanan: updatedLayanan,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
        error: error,
      });
    });
}

// DELETE data layanan
function destroy(req, res) {
  const id = req.params.id;

  models.Layanan.destroy({
    where: { id: id },
  })
    .then((result) => {
      res.status(200).json({
        message: "Layanan berhasil di hapus!",
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
  save: save,
  // show: show,
  index: index,
  update: update,
  destroy: destroy,
};
