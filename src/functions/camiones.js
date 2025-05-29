const { app } = require('@azure/functions');
const pool = require("../sql/db.js"); // Asegúrate de que la ruta sea correcta

app.http('camiones', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Procesando solicitud para: ${request.url}`);

    try {
      // Lista de clientes
      if (request.method === 'GET') {
        const { rows } = await pool.query('SELECT DISTINCT * FROM camiones ORDER BY dominio ASC');
        return {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rows)
        };
      }

    } catch (error) {
      context.log(`Error: ${error.message}`);
      return {
        status: 500,
        body: JSON.stringify({
          error: "Error al procesar la solicitud",
          details: error.message
        })
      };
    }
  }
});