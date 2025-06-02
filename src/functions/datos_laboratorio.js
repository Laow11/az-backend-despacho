const { app } = require('@azure/functions');
const pool = require("../sql/db.js");

app.http('laboratorio', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Procesando solicitud para: ${request.url}`);

    try {
      const body = await request.json();

      const query = `
        INSERT INTO datos_laboratorio (
          id, densidad, bsw, salinidad, densidad_corregida, bsw_total, tvr
        ) VALUES (
          1, $1, $2, $3, $4, $5, $6
        )
        ON CONFLICT (id) DO UPDATE SET
          densidad = EXCLUDED.densidad,
          bsw = EXCLUDED.bsw,
          salinidad = EXCLUDED.salinidad,
          densidad_corregida = EXCLUDED.densidad_corregida,
          bsw_total = EXCLUDED.bsw_total,
          tvr = EXCLUDED.tvr
        RETURNING *;
      `;

      const values = [
        body.densidad,
        body.bsw || null,
        body.salinidad || null,
        body.densidad_corregida || null,
        body.bsw_total || null,
        body.tvr || null
      ];

      const result = await pool.query(query, values);

      return {
        status: 200,
        jsonBody: result.rows[0]
      };

    } catch (error) {
      context.log(`Error: ${error}`);
      return {
        status: 500,
        jsonBody: { error: 'Error interno al guardar los datos del laboratorio' }
      };
    }
  }
});
