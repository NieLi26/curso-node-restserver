const { response } = require("express")

const validarArhivoSubir = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        const error = new Error("No hay archivos que subir - validarArchivoSubir")
        return res.status(400).json({
            msg: error.message
        });
    }

    next();
}

module.exports = {
    validarArhivoSubir
}