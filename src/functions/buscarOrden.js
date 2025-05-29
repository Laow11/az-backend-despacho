const { app } = require('@azure/functions');
const pool = require("../sql/db.js"); // Asegurate que esta ruta sea correcta

app.http('buscar-orden', {
  methods: ['GET'],
  route: 'orden/{id}', // Esta es la ruta dinámica
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Buscando orden con ID: ${request.params.id}`);

    const id = request.params.id;

    try {
      const { rows } = await pool.query('SELECT * FROM orden_carga WHERE id = $1', [id]);

      if (rows.length === 0) {
        return {
          status: 404,
          body: JSON.stringify({ message: 'Orden no encontrada' })
        };
      }

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows[0])
      };
    } catch (error) {
      context.log(`Error al buscar orden: ${error.message}`);
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
