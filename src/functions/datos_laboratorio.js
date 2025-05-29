const { app } = require('@azure/functions');
const pool = require("../sql/db.js"); // Asegúrate de que la ruta sea correcta

app.http('laboratorio', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Procesando solicitud para: ${request.url}`);

  try {
            const body = await request.json();

            const query = `
                INSERT INTO datos_laboratorio (
                    densidad, bsw, salinidad, densidad_corregida, bsw_total, tvr
                ) VALUES (
                    $1, $2, $3, $4, $5, $6
                ) RETURNING *;
            `;

            const values = [
                body.densidad,
                body.bsw || null,
                body.salinidad || null,
                body.densidad_corregida || null,
                body.bsw_total || null,  // $5 (antes estaba body.empresa aquí)
                body.tvr || null, 
            ];

            const result = await pool.query(query, values);

            return {
                status: 201,
                jsonBody: result.rows[0]
            };

        } catch (error) {
            context.log(`Error: ${error}`);
            return {
                status: 500,
                jsonBody: { error: 'Error interno al guardar la orden' }
            };
        }
  }
});