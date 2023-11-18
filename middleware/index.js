const validaCampos = require('../middleware/validar-campos');
const validaRoles = require('../helpers/db-validators');
const ValidaJWT = require('../middleware/validar-jwt');
const validarArhivo = require('../middleware/validar-archivo');


module.exports = {
    ...validaCampos,
    ...validaRoles,
    ...ValidaJWT,
    ...validarArhivo
}