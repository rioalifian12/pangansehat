const Validator = require("fastest-validator");
const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/transaksi");

// Register user
function signUp(req, res) {
  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "Email sudah digunakan!",
        });
      } else {
        bcryptjs.genSalt(10, function (err, salt) {
          bcryptjs.hash(req.body.password, salt, function (err, hash) {
            const user = {
              nama: req.body.nama,
              email: req.body.email,
              password: hash,
              alamat: req.body.alamat,
              noHp: req.body.no_hp,
              roleId: 1,
            };

            const schema = {
              nama: { type: "string", optional: false, max: "50" },
              email: { type: "string", optional: false, max: "50" },
              password: { type: "string", optional: false, max: "255" },
              alamat: { type: "string", optional: false, max: "255" },
              noHp: { type: "string", optional: false, max: "14" },
            };

            const v = new Validator();
            const validationResponse = v.validate(user, schema);

            if (validationResponse !== true) {
              return res.status(400).json({
                message: "Validasi gagal",
                errors: validationResponse,
              });
            }

            models.User.create(user)
              .then((result) => {
                res.status(201).json({
                  message: "Registrasi berhasil!",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Terjadi kesalahan!",
                });
              });
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
      });
    });
}

// Login user
function login(req, res) {
  const JWT_KEY = process.env.JWT_KEY;
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        res.status(401).json({
          message: "Email atau Password salah!",
        });
      } else {
        bcryptjs.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result) {
              const token = jwt.sign(
                {
                  nama: user.nama,
                  email: user.email,
                  alamat: user.alamat,
                  noHp: user.noHp,
                  roleId: user.roleId,
                  userId: user.id,
                },
                JWT_KEY,
                function (err, token) {
                  res.status(200).json({
                    message: "Autentikasi berhasil!",
                    token: token,
                  });
                }
              );
            } else {
              res.status(401).json({
                message: "Email atau Password salah!",
              });
            }
          }
        );
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Terjadi kesalahan!",
      });
    });
}

// GET data user by id
function show(req, res) {
  const id = req.params.id;

  models.User.findByPk(id)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(500).json({
          message: "User tidak ditemukan!",
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

// GET semua data user
function index(req, res) {
  models.User.findAll()
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

// UPDATE data user
function update(req, res) {
  bcryptjs.genSalt(10, function (err, salt) {
    bcryptjs.hash(req.body.password, salt, function (err, hash) {
      const id = req.params.id;
      const updatedUser = {
        nama: req.body.nama,
        email: req.body.email,
        password: hash,
        alamat: req.body.alamat,
        noHp: req.body.no_hp,
        roleId: req.body.role_id,
      };

      const schema = {
        nama: { type: "string", optional: false, max: "50" },
        email: { type: "string", optional: false, max: "50" },
        password: { type: "string", optional: false, max: "255" },
        alamat: { type: "string", optional: false, max: "255" },
        noHp: { type: "string", optional: false, max: "14" },
        roleId: { type: "number", optional: false },
      };

      const v = new Validator();
      const validationResponse = v.validate(updatedUser, schema);

      if (validationResponse !== true) {
        return res.status(400).json({
          message: "Validasi gagal",
          errors: validationResponse,
        });
      }

      models.Role.findByPk(req.body.role_id).then((result) => {
        if (result !== null) {
          models.User.update(updatedUser, {
            where: { id: id },
          })
            .then((result) => {
              res.status(200).json({
                message: "User berhasil di update!",
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
            message: "Invalid Role ID!",
          });
        }
      });
    });
  });
}

module.exports = {
  signUp: signUp,
  login: login,
  show: show,
  index: index,
  update: update,
};
