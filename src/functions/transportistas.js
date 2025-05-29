const { app } = require('@azure/functions');
const pool = require("../sql/db.js");

app.http('transportistas', {
  methods: ['GET', 'POST'], // Añade OPTIONS para preflight
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Procesando solicitud para: ${request.url}`);

    // Headers CORS para todas las respuestas
    const corsHeaders = {
      "Access-Control-Allow-Origin": "http://localhost:5173", // Reemplaza con tu URL de frontend
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    // Manejar solicitudes OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      return {
        status: 204, // No Content
        headers: corsHeaders
      };
    }

    try {
      if (request.method === 'GET') {
        const { rows } = await pool.query('SELECT * FROM transportistas ORDER BY empresa_transportista ASC');
        return {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(rows)
        };
      }

      // Manejar otros métodos (POST, etc.) si es necesario...

    } catch (error) {
      context.log(`Error: ${error.message}`);
      return {
        status: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Error al procesar la solicitud",
          details: error.message
        })
      };
    }
  }
});