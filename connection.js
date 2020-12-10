var mysql = require('mysql');

async function getConexion(tabla) {
    var resTabla = '', resCondicion = '', resConection;

    var conexionCentral = mysql.createConnection({
        host: 'localhost',
        database: 'sitiocentral',
        user: 'root',
        password: ''
    });

    var conexionSitio1 = mysql.createConnection({
        host: 'localhost',
        database: 'sitio1',
        user: 'root',
        password: ''
    });

    var conexionSitio2 = mysql.createConnection({
        host: 'localhost',
        database: 'sitio2',
        user: 'root',
        password: ''
    });

    conexionCentral.connect(function (error) {
        if (!error)
            console.log("Conexión exitosa Central");
        else
            throw error;
    });

    var dataLocalizacion = () => {
        return new Promise((resolve, reject) => {
            conexionCentral.query('SELECT * FROM localizacion WHERE tabla = ?', [tabla], (err, rows) => {
                if (err)
                    res.json(err);

                var row = rows[0];
                resTabla = row.nombre;

                conexionSitio2.connect(function (error) {
                    if (!error)
                        console.log("Conexión exitosa Sitio 2");
                    else
                        throw error;
                });

                conexionSitio1.connect(function (error) {
                    if (!error)
                        console.log("Conexión exitosa Sitio 1");
                    else
                        throw error;
                });

                resConection = {
                    BD: conexionSitio2,
                    tabla: resTabla,
                    condicion: resCondicion
                }

                resolve();
            });
        });
    }

    await dataLocalizacion();
    return resConection;
}

module.exports = {
    getConexion
}