const { response } = require("express");
const { generateJWT } = require("../helpers/jwt");
var bcrypt = require("bcryptjs");
const Users = require("../models/Users");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Users.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario ya existe",
      });
    }
    usuario = new Users(req.body);
    //Encrypt password
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //generate our=nuestros JWT=JSON Web Token
    const token = await generateJWT(usuario.id, usuario.name, usuario.email);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      email: usuario.email,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error, hable con el admin",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Users.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario NO existe",
      });
    }

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "password invalid",
      });
    }

    //generate our=nuestros JWT=JSON Web Token
    const token = await generateJWT(usuario.id, usuario.name, usuario.email);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      email: usuario.email,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error, hable con el admin",
    });
  }
};

const editAccount = async (req, res = response) => {
  const { id, newName, newPassword } = req.body;

  try {
    let usuario = await Users.findById(id);
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario NO existe",
      });
    }

    if (!newPassword && newPassword.length <= 0) {
      usuario.name = newName;
      const usuarioActualizado = await usuario.save();
      return res.json({
        ok: true,
        usuario: usuarioActualizado,
      });
    }

    //todo: compareSync(text plano, password encrypt). Equals TRUE, different FALSE
    const validPassword = bcrypt.compareSync(newPassword, usuario.password);

    if (validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "El nuevo password es igual a la antigua",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(newPassword, salt);
    usuario.name = newName;
    const usuarioActualizado = await usuario.save();

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al editar la cuenta",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const uid = req.uid;
  const name = req.name;
  const email = req.email;

  //generate token
  const token = await generateJWT(uid, name, email);

  res.json({
    ok: true,
    uid,
    name,
    email,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  editAccount,
  revalidarToken,
};
