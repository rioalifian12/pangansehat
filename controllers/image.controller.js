function upload(req, res) {
  if (req.file.filename) {
    res.status(201).json({
      mesaage: "Upload image berhasil!",
      url: req.file.filename,
    });
  } else {
    res.status(500).json({
      mesaage: "Terjadi kesalahan!",
    });
  }
}

module.exports = {
  upload: upload,
};
