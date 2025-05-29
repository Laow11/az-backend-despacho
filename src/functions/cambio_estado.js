const { app } = require('@azure/functions');
const pool = require("../sql/db.js"); // Asegúrate de que la ruta sea correcta

app.http('cambio-estado', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
      context.log(`Procesando solicitud para: ${request.url}`);
  
      const body = await request.json(); // 👈 Agregá esto
      const { ordenId, estado } = body;
      context.log(ordenId, estado);
  
      if (!ordenId || !estado) {
        return {
          status: 400,
          body: JSON.stringify({
            error: "Los campos 'ordenId' y 'estado' son requeridos"
          })
        };
      }
  
      if (estado !== "aprobada" && estado !== "pendiente" && estado !== "rechazada") {
        return {
          status: 400,
          body: JSON.stringify({
            error: "El estado debe ser 'aprobada' o 'rechazada'"
          })
        };
      }
  
      try {
        const query = 'UPDATE orden_carga SET estado = $1 WHERE id = $2';
        const queryParams = [estado, ordenId];
  
        const result = await pool.query(query, queryParams);
  
        if (result.rowCount === 0) {
          return {
            status: 404,
            body: JSON.stringify({
              error: "Orden no encontrada"
            })
          };
        }
  
        return {
          status: 200,
          body: JSON.stringify({
            message: `Orden ${ordenId} actualizada con estado ${estado}`,
            estado
          })
        };
  
      } catch (error) {
        context.log(`Error: ${error.message}`);
        return {
          status: 500,
          body: JSON.stringify({
            error: "Error al actualizar la orden",
            details: error.message
          })
        };
      }
    }
  });
