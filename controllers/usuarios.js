const { request, response } = require('express') // se importa para e; autocompletado

const usuariosGet = (req = request, res = response) => {
    const { q, nombre } = req.query
    console.log(req.query);

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre
    })
}

const usuariosPost = (req, res = response) => {
    console.log('data', req.body);
    res.json({
        msg: 'post API - Controlador',
        body: req.body
    })
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params;
    console.log(id);

    res.json({
        msg: 'put API - Controlador',
        id
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - Controlador'
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}