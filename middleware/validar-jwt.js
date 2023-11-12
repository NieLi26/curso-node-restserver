const { response, request } = require('express')
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async ( req = request, res = response, next ) => {
    const token = req.header('x-token');
    
    if ( !token ) {
        const error = new Error('No hay token en la peticion')
        return res.status(401).json({ msg: error.message })
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid)

        // SI el usuario no existe
        if ( !usuario ) {
            const error = new Error('Token no valido - usuario no existe en DB')
            return res.status(401).json({ msg: error.message })
        }

        // verificar si el uid tiene estado true
        if ( !usuario.estado ) {
            const error = new Error('Token no valido - usuario con estado: false')
            return res.status(401).json({ msg: error.message })
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        const err = new Error('Token no valido')
        return res.status(401).json({ msg: err.message })
    }
}


module.exports = {
    validarJWT
}