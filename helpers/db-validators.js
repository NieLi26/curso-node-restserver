const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`EL rol ${rol} no esta registrado en la BD`)
    }
}

const emaiExiste = async ( correo = '' ) => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo })
    if ( existeEmail ) {
        const error = new Error(`El correo ${correo} ya esta registrado en la BD`)
        throw error
    }
}

const existeUsuarioPorId = async ( id ) => {
    // Verificar si el usuario existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}

const existeCategoriaPorId = async ( id ) => {
    // Verificar si la categoria existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}

const esCategoriaValida = async (categoria = '') => {
    const existeCategoria = await Categoria.findById( categoria );
    if ( !existeCategoria ) {
        throw new Error(`La Categoria ${categoria} no esta registrado en la BD`)
    }
}

const existeProductoPorId = async ( id ) => {
    // Verificar si la categoria existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`)
    }

    return true
}

module.exports = {
    esRoleValido,
    emaiExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    esCategoriaValida,
    coleccionesPermitidas
}