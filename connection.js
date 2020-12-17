var mysql = require('mysql');

async function getConexion(tabla, sitio) {
  var resTabla = '',
    resCondicion = '',
    auxResConection = [];
  let resConection = [];
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
        if (err) console.log(err);

        var row = rows[0];

        if (row.tipo === null) {
          switch (row.sitio) {
            case 1:
              conexionSitio1.connect(function (error) {
                if (!error) console.log('Conexión exitosa Sitio 1');
                else throw error;
              });

              resConection = {
                BD: conexionSitio1,
                tabla: row.nombre
              };

              resolve();
              break;
            case 2:
              conexionSitio2.connect(function (error) {
                if (!error) console.log('Conexión exitosa Sitio 2');
                else throw error;
              });

              resConection = {
                BD: conexionSitio2,
                tabla: row.nombre
              };

              resolve();
              break;
          }
        } else {
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
              if (sitio !== null) {
                switch (sitio) {
                  case 1:
                    conexionSitio1.connect(function (error) {
                      if (!error) console.log('Conexión exitosa Sitio 1');
                      else throw error;
                    });

                    resConection = {
                      BD: conexionSitio1,
                      tabla: rows.find((x) => x.sitio === sitio).nombre
                    };

                    resolve();
                    break;
                  case 2:
                    conexionSitio2.connect(function (error) {
                      if (!error) console.log('Conexión exitosa Sitio 2');
                      else throw error;
                    });

                    resConection = {
                      BD: conexionSitio2,
                      tabla: rows.find((x) => x.sitio === sitio).nombre
                    };

                    resolve();
                    break;
                }
              } else {
                for (let fragmento of rows) {
                  switch (fragmento.sitio) {
                    case 1:
                      conexionSitio1.connect(function (error) {
                        if (!error) console.log('Conexión exitosa Sitio 1');
                        else throw error;
                      });

                      auxResConection.push({
                        BD: conexionSitio1,
                        tabla: fragmento.nombre
                      });

                      break;
                    case 2:
                      conexionSitio2.connect(function (error) {
                        if (!error) console.log('Conexión exitosa Sitio 2');
                        else throw error;
                      });

                      auxResConection.push({
                        BD: conexionSitio2,
                        tabla: fragmento.nombre
                      });

                      break;
                  }
                }
                resConection = auxResConection;
                resolve();
              }

              break;
            case 'Replica':
              for (let fragmento of rows) {
                switch (fragmento.sitio) {
                  case 1:
                    conexionSitio1.connect(function (error) {
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
                    conexionSitio2.connect(function (error) {
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
