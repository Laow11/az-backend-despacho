const { app } = require('@azure/functions');
const pool = require("../sql/db.js");

// Función solo para GET (obtener el único registro)
app.http('laboratorio-get', {
  methods: ['GET'], // Solo método GET
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Procesando GET para laboratorio: ${request.url}`);

    try {
      // Obtener el único registro (usando LIMIT 1 para mayor seguridad)
      const { rows } = await pool.query('SELECT * FROM datos_laboratorio LIMIT 1');
      
      if (rows.length === 0) {
        return {
          status: 404,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "No se encontraron registros" })
        };
      }

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows[0]) // Devuelve solo el primer registro
      };

    } catch (error) {
      context.log(`Error en laboratorio-get: ${error.message}`);
      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Error al obtener los datos del laboratorio",
          details: error.message
        })
      };
    }
  }
});

// Función separada para POST (crear/actualizar registro)
app.http('laboratorio-post', {
  methods: ['POST'], // Solo método POST
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Procesando POST para laboratorio: ${request.url}`);

    try {
      const body = await request.json();
      
      // Aquí iría tu lógica para insertar/actualizar
      // Ejemplo:
      const { rows } = await pool.query(
        'INSERT INTO datos_laboratorio (...) VALUES (...) RETURNING *',
        [body.densidad, body.bsw, /* otros campos */]
      );

      return {
        status: 201,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows[0])
      };

    } catch (error) {
      context.log(`Error en laboratorio-post: ${error.message}`);
      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Error al guardar los datos del laboratorio",
          details: error.message
        })
      };
    }
  }
});