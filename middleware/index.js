const validaCampos = require('../middleware/validar-campos');
const validaRoles = require('../helpers/db-validators');
const ValidaJWT = require('../middleware/validar-jwt');


module.exports = {
    ...validaCampos,
    ...validaRoles,
    ...ValidaJWT
}