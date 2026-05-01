import { Router } from 'express';
import { createOpportunity, updateOpportunityStage, getOpportunitiesByClient } from '../controllers/opportunityController';

const router = Router();

/**
 * @swagger
 * /api/opportunities:
 *   post:
 *     summary: Crear oportunidad de negocio (US-13)
 *     tags: [Opportunities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOpportunityRequest'
 *     responses:
 *       201:
 *         description: Oportunidad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       400:
 *         description: Validación fallida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cliente no encontrado
 */
router.post('/', createOpportunity);

/**
 * @swagger
 * /api/opportunities/{id}/stage:
 *   patch:
 *     summary: Avanzar etapa de oportunidad (US-14)
 *     tags: [Opportunities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oportunidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOpportunityStageRequest'
 *     responses:
 *       200:
 *         description: Etapa actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       400:
 *         description: Validación fallida (etapa inválida o no se puede cambiar)
 *       404:
 *         description: Oportunidad no encontrada
 */
router.patch('/:id/stage', updateOpportunityStage);

/**
 * @swagger
 * /api/opportunities/client/{clienteId}:
 *   get:
 *     summary: Listar oportunidades por cliente (US-15)
 *     tags: [Opportunities]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de oportunidades del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Opportunity'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/client/:clienteId', getOpportunitiesByClient);

export default router;
