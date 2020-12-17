var mysql = require('mysql');

async function getConexion(tabla) {
  let resConection = [];
  var resTabla = '',
    resCondicion = '';

  var conexionCentral = mysql.createPool({
    host: 'localhost',
    database: 'sitiocentral',
    user: 'root',
    password: ''
  });

  var conexionSitio1 = mysql.createPool({
    host: 'localhost',
    database: 'sitio1',
    user: 'root',
    password: ''
  });

  var conexionSitio2 = mysql.createPool({
    host: 'localhost',
    database: 'sitio2',
    user: 'root',
    password: ''
  });

  conexionCentral.getConnection(function (error) {
    if (!error) console.log('Conexión exitosa Central');
    else throw error;
  });

  con = {
    central: conexionCentral
  };
  resConection.push(con);
  var dataLocalizacion = () => {
    return new Promise((resolve, reject) => {
      conexionCentral.query('SELECT * FROM localizacion WHERE tabla = ?', [tabla], (err, rows) => {
        if (err) res.json(err);

        var row = rows[0];

        if (row.tipo !== null) {
          switch (row.tipo) {
            case 'Vertical':
              for (let fragmento of rows) {
                switch (fragmento.sitio) {
                  case 1:
                    conexionSitio1.getConnection(function (error) {
                      if (!error) console.log('Conexión exitosa Sitio 1');
                      else throw error;
                    });

                    con = {
                      BD1: conexionSitio1,
                      tabla: fragmento.nombre,
                      sitio: fragmento.sitio
                    };
                    resConection.push(con);

                    break;
                  case 2:
                    conexionSitio2.getConnection(function (error) {
                      if (!error) console.log('Conexión exitosa Sitio 2');
                      else throw error;
                    });
                    con = {
                      BD2: conexionSitio2,
                      tabla: fragmento.nombre,
                      sitio: fragmento.sitio
                    };
                    resConection.push(con);

                    break;
                }
              }
              resolve(resConection);

              return resConection;
            case 'Horizontal':
              for (let fragmento of rows) {
                switch (fragmento.sitio) {
                  case 1:
                    conexionSitio1.getConnection(function (error) {
                      if (!error) console.log('Conexión exitosa Sitio 1');
                      else throw error;
                    });

                    resConection = {
                      BD: conexionSitio1,
                      tabla: fragmento.nombre,
                      condicion: resCondicion
                    };

                    resolve();
                    break;
                  case 2:
                    conexionSitio2.getConnection(function (error) {
                      if (!error) console.log('Conexión exitosa Sitio 2');
                      else throw error;
                    });

                    resConection = {
                      BD: conexionSitio2,
                      tabla: fragmento.nombre,
                      condicion: resCondicion
                    };

                    resolve();
                    break;
                }
              }
              break;
            case 'Replica':
              resolve();

              break;
          }
        } else {
          switch (row.sitio) {
            case 1:
              conexionSitio1.getConnection(function (error) {
                if (!error) console.log('Conexión exitosa Sitio 1');
                else throw error;
              });

              resConection = {
                BD: conexionSitio1,
                tabla: row.nombre,
                condicion: resCondicion
              };

              resolve();
              break;
            case 2:
              conexionSitio2.getConnection(function (error) {
                if (!error) console.log('Conexión exitosa Sitio 2');
                else throw error;
              });

              resConection = {
                BD: conexionSitio2,
                tabla: row.nombre,
                condicion: resCondicion
              };

              resolve();
              break;
          }
        }
      });
    });
  };

  await dataLocalizacion();

  return resConection;
}

module.exports = {
  getConexion
};
