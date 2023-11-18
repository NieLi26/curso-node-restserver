const { check } = require('express-validator');
const { Router } = require('express');
const { validarCampos, validarArhivoSubir } = require('../middleware');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArhivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArhivoSubir,
    check('id', 'El id debe dser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos']) ),
    validarCampos
], actualizarImagenCloudinary)
// ], actualizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'El id debe dser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos']) ),
    validarCampos
], mostrarImagen)

module.exports = router