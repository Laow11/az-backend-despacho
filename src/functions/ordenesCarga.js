const { app } = require('@azure/functions');
const pool = require("../sql/db.js"); // Asegúrate de que la ruta sea correcta

app.http('crear-orden', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log(`Procesando solicitud para: ${request.url}`);

  try {
            const body = await request.json();

            const query = `
                INSERT INTO orden_carga (
                    fecha, numero, yacimiento, destino, cuit, domicilio,
                    transportista, cuit_transporte, domicilio_transporte,
                    telefono, chofer, dni_chofer, dominio_tractor, dominio_semi,
                    capacidad, calibracion, venc_calibracion, vtv, seguro, empresa, porcuentayorden
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
                ) RETURNING *;
            `;

            const values = [
                body.fecha,
                body.numero || null,
                body.yacimiento || 'Rincón de la ceniza',
                body.destino || null,
                body.cuit || null,  // $5 (antes estaba body.empresa aquí)
                body.domicilio || null,
                body.transportista || null,
                body.cuit_transporte || null,
                body.domicilio_transporte || null,
                body.telefono || null,
                body.chofer || null,
                body.dni_chofer || null,
                body.camion.dominio_tractor || null,
                body.camion.dominio_semi || null,
                body.camion.capacidad || null,
                body.camion.calibracion || null,
                body.camion.venc_calibracion || null,
                body.camion.vtv || null,
                body.camion.seguro || null,  // $19
                body.empresa || null,  // $20
                body.porcuentayorden || null // $21
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