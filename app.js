const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const transaksiRoute = require("./routes/transaksi");
const userRoute = require("./routes/user");
const layananRoute = require("./routes/layanan");
const ulasanRoute = require("./routes/ulasan");
const imageRoute = require("./routes/image");

const cors = require("cors");

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.use("/transaksi", transaksiRoute);
app.use("/user", userRoute);
app.use("/layanan", layananRoute);
app.use("/ulasan", ulasanRoute);
app.use("/image", imageRoute);

module.exports = app;
