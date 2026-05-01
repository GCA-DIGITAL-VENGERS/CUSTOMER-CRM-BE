import { Router } from 'express';
import { getDashboardSummary, exportClientsCSV } from '../controllers/dashboardController';

const router = Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Obtener resumen con KPIs (US-22)
 *     tags: [Dashboard]
 *     description: Resumen ejecutivo con métricas clave para tomar decisiones comerciales
 *     responses:
 *       200:
 *         description: KPIs del negocio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummary'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/summary', getDashboardSummary);

/**
 * @swagger
 * /api/clients/export/csv:
 *   get:
 *     summary: Exportar clientes en CSV (US-23)
 *     tags: [Clients]
 *     description: Descarga lista completa de clientes en formato CSV para compartir con el equipo
 *     responses:
 *       200:
 *         description: Archivo CSV descargado
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error interno del servidor
 */
router.get('/export/csv', exportClientsCSV);

export default router;
