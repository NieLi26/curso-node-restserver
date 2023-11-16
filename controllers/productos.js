const { response } = require("express");
const { Producto } = require('../models')

const obtenerProductos = async (req, res= response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    try {
        const [ total, productos ] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .skip(+desde)
                .limit(+limite)
                .populate('usuario')
                .populate('categoria')
        ])
    
        res.json({
            total,
            productos
        })
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        })
    }

}

const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')

        if ( !producto ) {
            const error = new Error('Producto no existe')
            return res.status(404).json({
                msg: error.message
            })
        }


        res.json(producto)
    
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }


}

const crearProducto = async ( req, res = response ) => {
    const { usuario, estado, disponible, ...resto } = req.body

    resto.nombre = resto.nombre.toUpperCase();

    try {
        const productoDB = await Producto.findOne({ nombre: resto.nombre });

        if ( productoDB ) {
            const error = new Error(`El Producto ${productoDB.nombre}, ya existe`)
            return res.status(404).json({
                msg: error.message
            });
        }
    
        // Generar la data a guardar
        const data = {
            ...resto,
            usuario: req.usuario._id
        }
    
        const producto = new Producto( data );
    
        // Guardar DB
        await producto.save();
    
        res.status(201).json(producto)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const actualizarProducto = async ( req, res = response ) => {
    const { id } = req.params
    const { usuario, estado, disponible, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase()
    resto.usuario = req.usuario._id

    try {
        const producto = await Producto.findByIdAndUpdate(id, resto, { new: true })
        res.json(producto)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const borrarProducto = async ( req, res = response ) => {
    const { id } = req.params;

    // Fisicamente lo borramos
    // const producto = await Producto.findByIdAndDelete(id);
    try {
        const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true })
        res.json(producto) 
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}