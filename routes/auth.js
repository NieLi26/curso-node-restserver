const { check } = require('express-validator');
const { Router } = require('express');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'EL correo es Obligatorio').isEmail(),
    check('password', 'La contraseña es Obligatoria').not().isEmpty(),
    validarCampos 
], login);

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos 
], googleSignIn);


module.exports = router