import { Router } from 'express';
import { createActivity, getActivitiesByClient } from '../controllers/activityController';

const router = Router();

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Registrar actividad de cliente (US-17)
 *     tags: [Activities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityRequest'
 *     responses:
 *       201:
 *         description: Actividad registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
 *       400:
 *         description: Validación fallida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cliente no encontrado
 *   get:
 *     summary: Listar actividades de un cliente (US-17)
 *     tags: [Activities]
 *     parameters:
 *       - in: query
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de actividades del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *       400:
 *         description: clienteId es requerido
 *       404:
 *         description: Cliente no encontrado
 */
router.post('/', createActivity);
router.get('/', getActivitiesByClient);

export default router;
