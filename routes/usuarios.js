const { check } = require('express-validator');
const { Router } = require('express');
const { 
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete 
} = require('../controllers/usuarios');
const { validarCampos } = require('../middleware/validar-campos');
const { esRoleValido, emaiExiste, existeUsuarioPorId } = require('../helpers/db-validators');

 const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'El password debe ser de mas de 6 letras').isLength({min: 6}),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('rol').custom( esRoleValido ),
    check('correo').custom( emaiExiste ),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
],usuariosPost);

router.delete('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);


module.exports = router