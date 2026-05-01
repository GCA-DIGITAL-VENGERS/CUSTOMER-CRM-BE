import { Router } from 'express';
import { createContact, getContactsByClient } from '../controllers/contactController';

const router = Router();

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Registrar contacto vinculado a un cliente (US-12)
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContactRequest'
 *     responses:
 *       201:
 *         description: Contacto registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Validación fallida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cliente no encontrado
 */
router.post('/', createContact);

/**
 * @swagger
 * /api/contacts/client/{clienteId}:
 *   get:
 *     summary: Obtener todos los contactos de un cliente
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de contactos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/client/:clienteId', getContactsByClient);

export default router;
