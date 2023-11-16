const { response } = require("express");
const { Categoria } = require('../models')

const obtenerCategorias = async (req, res= response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    try {
        const [ total, categorias ] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(+desde)
                .limit(+limite)
                .populate('usuario')
        ])
    
        res.json({
            total,
            categorias
        })
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        })
    }

}

const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;

    try {
        const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre')

        if ( !categoria ) {
            const error = new Error('Categoria no existe')
            return res.status(404).json({
                msg: error.message
            })
        }


        res.json(categoria)
    
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }


}

const crearCategoria = async ( req, res = response ) => {
    const nombre = req.body.nombre.toUpperCase();

    try {
        const categoriaDB = await Categoria.findOne({ nombre });

        if ( categoriaDB ) {
            const error = new Error(`La categoria ${categoriaDB.nombre}, ya existe`)
            return res.status(404).json({
                msg: error.message
            });
        }
    
        // Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id
        }
    
        const categoria = new Categoria( data );
    
        // Guardar DB
        await categoria.save();
    
        res.status(201).json(categoria)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const actualizarCategoria = async ( req, res = response ) => {
    const { id } = req.params
    const { usuario, estado, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase()
    resto.usuario = req.usuario._id

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true })
        res.json(categoria)
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

const borrarCategoria = async ( req, res = response ) => {
    const { id } = req.params;

    // Fisicamente lo borramos
    // const categoria = await Categoria.findByIdAndDelete(id);
    try {
        const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true })
        res.json(categoria) 
    } catch (error) {
        console.log(error);
        const err = new Error('Error Inesperado, intente nuevamente')
        res.status(500).json({
            msg: err.message
        }) 
    }

}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}