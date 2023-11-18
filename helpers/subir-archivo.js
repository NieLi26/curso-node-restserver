const path = require('path');
const { v4: uuidv4 } = require('uuid');

const EXTENSIONES_VALIDAS = ['png', 'jpg', 'jpeg', 'gif'];

const subirArchivo = ( files, extensionesValidas = EXTENSIONES_VALIDAS, carpeta = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado.pop();
    
        // Validar la extension    
        if ( !extensionesValidas.includes(extension) ) {
            return reject(`La extension ${extension} no es permitida - ${ extensionesValidas }`)
        }
    
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, "../uploads/", carpeta,  nombreTemp);
    
        archivo.mv(uploadPath, err => {
            if (err) {
                return reject(err)
            }
    
            resolve(nombreTemp)
        });
    })

}


module.exports = {
    subirArchivo
}