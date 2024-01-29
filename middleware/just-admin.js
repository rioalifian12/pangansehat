const jwt = require("jsonwebtoken");
const models = require("../models");

async function justAdmin(req, res, next) {
  try {
    const JWT_KEY = process.env.JWT_KEY;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_KEY);

    const roleId = decodedToken.roleId;
    // get role by id
    const role = await models.Role.findByPk(roleId);
    const namaRole = role.namaRole;
    if (namaRole != "Admin") throw new Error("Role anda bukan admin!");

    req.userData = decodedToken;
    next();
  } catch (error) {
    const messageError = error?.message
      ? error.message
      : "Token invalid atau expired!";
    return res.status(401).json({
      message: messageError,
    });
  }
}

module.exports = {
  justAdmin: justAdmin,
};
