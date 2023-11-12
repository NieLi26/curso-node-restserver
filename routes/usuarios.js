const { check } = require('express-validator');
const { Router } = require('express');
const { 
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete 
} = require('../controllers/usuarios');

const { 
    validarCampos,
    esRoleValido,
    emaiExiste,
    existeUsuarioPorId,
    validarJWT
} = require('../middleware')

const { esAdminRole, tieneRole } = require('../middleware/validar-roles');

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
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROL'),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);


module.exports = router