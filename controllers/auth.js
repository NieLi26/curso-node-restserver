const { response } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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


const googleSignIn = async ( req, res = response ) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save()
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            const error = new Error('Hable con el administrador, usuario bloqueado')
            return res.status(401).json({
                msg: error.message
            })
        }

        // generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        const err = new Error('El token no se pudo verificar')
        res.status(400).json({
            ok: false,
            msg: err.message
        })
    }

}

module.exports = {
    login,
    googleSignIn
}