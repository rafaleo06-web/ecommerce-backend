const { Router } = require("express");
const { check } = require("express-validator");
const { createOrders, getOrders, updateOrders, deleteOrders } = require("../controllers/order");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { isDate } = require("../helpers/isDate");

const router = Router();

//valid for all the requests
router.use(validarJWT);

router.get("/", getOrders);
router.post(
  "/new",
  [
    check("products", "debe haber al menos 1 producto").not().isEmpty(),
    check("date", "fecha es obligatoria").custom(isDate),
    validarCampos,
  ],
  createOrders
);
router.put("/:id", updateOrders);
router.delete("/:id", deleteOrders);

module.exports = router;
