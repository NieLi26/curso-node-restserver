const { check } = require('express-validator');
const { Router } = require('express');
const { validarJWT, validarCampos, existeProductoPorId, esCategoriaValida } = require('../middleware');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { esAdminRole } = require('../middleware/validar-roles');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerProductos);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', 
[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom( esCategoriaValida ),
    validarCampos
] 
, crearProducto);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom( esCategoriaValida ),
    validarCampos
], actualizarProducto);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);

module.exports = router