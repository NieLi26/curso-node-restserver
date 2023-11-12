const { response } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if ( !usuario ) {
            const error = new Error('Credenciales incorrectas - correo')
            return res.status(400).json({msg: error.message});
        }
        // si el usuario esta activo
        if ( !usuario.estado ) {
            const error = new Error('Credenciales incorrectas - Estado False')
            return res.status(400).json({msg: error.message});
        }

        // Verificar la contrasena
        const validPassword = bcryptjs.compareSync( password,  usuario.password);
        if ( !validPassword ) {
            const error = new Error('Credenciales incorrectas - password')
            return res.status(400).json({msg: error.message});
        }

        // generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    login
}