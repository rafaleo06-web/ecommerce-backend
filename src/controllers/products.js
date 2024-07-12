const { response } = require("express");
const Product = require("../models/Product");

const createProducts = async (req, res = response) => {
  const product = new Product(req.body);

  try {
    const productSave = await product.save();

    res.json({
      ok: true,
      productSave,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "hable con el admin",
    });
  }
};
module.exports = {
  createProducts,
};
