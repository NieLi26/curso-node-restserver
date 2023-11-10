const Role = require('../models/role');
const Usuario = require('../models/usuario');

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
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        const error = new Error(`El id ${id} no existe`)
        throw error
    }
}



module.exports = {
    esRoleValido,
    emaiExiste,
    existeUsuarioPorId
}