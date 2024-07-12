const { Schema, model } = require("mongoose");

const OrderShema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  products: [
    {
      title: {
        type: String,
        required: true,
      },
      id: {
        type: Number,
        required: true,
        unique: true,
      },
      description: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
      },
      image: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalProducts: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
});

OrderShema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Order", OrderShema);
