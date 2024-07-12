const { response } = require("express");
const Order = require("../models/Order");

const createOrders = async (req, res = response) => {
  const { date, products, totalProducts, totalPrice } = req.body;

  try {
    const orders = new Order({
      date,
      products,
      totalProducts,
      totalPrice,
    });
    orders.user = req.uid;
    const OrderSave = await orders.save();

    res.json({
      ok: true,
      OrderSave,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
      error: error.message,
    });
  }
};

const getOrders = async (req, res = response) => {
  try {
    console.log(req);
    const userId = req.uid;
    const orders = await Order.find({ user: userId }).populate("products");
    res.json({
      ok: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error al obtener las órdenes" });
  }
};

const updateOrders = async (req, res = response) => {
  try {
    const orderId = req.params.id;
    const { productId, action } = req.body;

    let orderExists = await Order.findById(orderId);

    if (!orderExists) {
      return res.status(404).json({
        ok: false,
        msg: "Order not found",
      });
    }

    if (orderExists.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "you have not privileges",
      });
    }

    const productIndex = orderExists.products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        ok: false,
        msg: "Product not found in the order",
      });
    }

    const product = orderExists.products[productIndex];

    if (action === "increment") {
      product.quantity += 1;
    } else if (action === "decrement") {
      if (product.quantity === 1) {
        orderExists.products = orderExists.products.filter((p) => p.id !== productId);
      } else {
        product.quantity -= 1;
      }
    }

    let updatedTotalPrice = 0;
    let updatedTotalProducts = 0;

    orderExists.products.forEach((product) => {
      updatedTotalPrice += product.quantity * product.price;
      updatedTotalProducts += product.quantity;
    });

    orderExists.totalPrice = updatedTotalPrice;
    orderExists.totalProducts = updatedTotalProducts;

    if (orderExists.totalProducts === 0) {
      // Delete the order
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      return res.json({
        ok: true,
        msg: "Order deleted because there are no products left",
      });
    }

    const orderUpdated = await Order.findByIdAndUpdate(orderId, orderExists, { new: true });

    res.json({
      ok: true,
      orderUpdated,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "hable con el admin",
    });
  }
};

const deleteOrders = async (req, res = response) => {
  try {
    const orderId = req.params.id;

    const deleteOrder = await Order.findByIdAndDelete(orderId);

    if (!deleteOrder) {
      return res.status(404).json({
        ok: false,
        msg: "Order not found",
      });
    }

    if (deleteOrder.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "you have not privileges",
      });
    }

    res.json({
      ok: true,
      deleteOrder,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "hable con el admin",
    });
  }
};

module.exports = {
  createOrders,
  getOrders,
  updateOrders,
  deleteOrders,
};
