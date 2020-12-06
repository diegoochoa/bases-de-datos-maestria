var mysql = require('mysql');

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

conexionSitio1.connect(function (error) {
    if (!error)
        console.log("Conexión exitosa Sitio 1");
    else
        throw error;
});

conexionSitio2.connect(function (error) {
    if (!error)
        console.log("Conexión exitosa Sitio 2");
    else
        throw error;
});

module.exports = {
    conexionSitio1,
    conexionSitio2
}