const { check } = require('express-validator');
const { Router } = require('express');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'EL correo es Obligatorio').isEmail(),
    check('password', 'La contraseña es Obligatoria').not().isEmpty(),
    validarCampos 
], login);


module.exports = router