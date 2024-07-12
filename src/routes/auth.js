const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { loginUsuario, crearUsuario, revalidarToken, editAccount } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/new",
  [
    check("name", "el nombre es obligatorio").not().isEmpty(),
    check("email", "el email es obligatorio").isEmail(),
    check("password", "el password debe tener 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/",
  [
    check("email", "el email es obligatorio").isEmail(),
    check("password", "el password debe tener 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  loginUsuario
);

router.put(
  "/edit",
  [
    check("newName", "el nombre es obligatorio").not().isEmpty(),
    // check("newPassword", "el password debe tener 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  editAccount
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
