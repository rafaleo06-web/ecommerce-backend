const { Router } = require("express");
const { check } = require("express-validator");
const { createProducts } = require("../controllers/products");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

//valid for all the requests
router.use(validarJWT);

router.post("/", [check("title", "el titulo es obligatorio").not().isEmpty(), validarCampos], createProducts);

module.exports = router;
