const express = require("express");
const { dbConnection } = require("./database/config");
require("dotenv").config();

var cors = require("cors");

const app = express();

dbConnection();
app.use(cors());

//public directory
app.use(express.static("public"));

//reading y parsing
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
});
