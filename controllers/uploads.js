const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const { Usuario, Producto } = require('../models')

const cargarArchivo = async (req, res = response) => {

    try {
        // const nombre = await subirArchivo( req.files, [ 'txt', 'md' ], 'textos' )
        const nombre = await subirArchivo( req.files, undefined, 'imgs' )
        res.json({ nombre })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error
        })
    }

};

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    // Limpiar imagenes previas 
    if ( modelo.img ) {
        // hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }

    }

    nombre = await subirArchivo( req.files, undefined, coleccion )
    modelo.img = nombre;
    await modelo.save();

    res.json(modelo)
};

const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    // Limpiar imagenes previas 
    if ( modelo.img ) {
        const nombre = modelo.img.split('/').pop();
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    
    modelo.img = secure_url;
    await modelo.save();

    res.json(modelo)
};

const mostrarImagen = async (req, res = response) => {
    
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    // Verificar si existe imagenes previas 
    if ( modelo.img ) {
        // hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen )
        }

    }

    // Si no existe imagen
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg' );
    return res.sendFile( pathImagen );
};


module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};
