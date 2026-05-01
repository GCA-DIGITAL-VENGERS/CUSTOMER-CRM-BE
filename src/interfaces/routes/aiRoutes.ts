import { Router } from 'express';
import { aiController } from '../controllers/aiController';

const router = Router();

/**
 * @swagger
 * /api/ai/ask:
 *   post:
 *     summary: Preguntar al Asistente RAG (JSON Response)
 *     description: Envía una pregunta al asistente inteligente y recibe la respuesta completa en JSON. Ideal para probar en Swagger UI.
 *     tags:
 *       - AI & RAG
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 message: "¿Cuáles son los endpoints disponibles para gestionar clientes?"
 *             ejemplo2:
 *               value:
 *                 message: "¿Cómo crear una nueva oportunidad de ventas?"
 *             ejemplo3:
 *               value:
 *                 message: "¿Qué información proporciona el dashboard?"
 *     responses:
 *       200:
 *         description: Respuesta exitosa con la pregunta contestada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "¿Cuáles son los endpoints disponibles para gestionar clientes?"
 *                 response:
 *                   type: string
 *                   example: "El sistema CRM proporciona los siguientes endpoints para gestionar clientes: POST /api/clients para crear, GET /api/clients para listar, GET /api/clients/{id} para obtener un cliente específico..."
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     chunksRetrieved:
 *                       type: integer
 *                       example: 3
 *                       description: Número de fragmentos de contexto utilizados
 *                     intent:
 *                       type: string
 *                       enum: ['how-to', 'data-query', 'general']
 *                       example: "data-query"
 *                       description: Tipo de pregunta detectada
 *       400:
 *         description: Mensaje requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message is required"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
/**
 * @swagger
 * /api/ai/ask-history:
 *   post:
 *     summary: Chat con historial de conversación (Recomendado)
 *     description: Envía una pregunta manteniendo el historial de la conversación. Cada conversación tiene un ID único que permite continuar conversaciones anteriores.
 *     tags:
 *       - AI & RAG
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['message']
 *             properties:
 *               message:
 *                 type: string
 *                 maxLength: 5000
 *                 example: "¿Cuáles son los endpoints disponibles para gestionar clientes?"
 *                 description: Pregunta para el asistente
 *               conversationId:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: ID de conversación existente (opcional). Si no se proporciona, se crea una nueva.
 *           examples:
 *             primera_pregunta:
 *               value:
 *                 message: "¿Cómo creo un nuevo cliente?"
 *             continuacion:
 *               value:
 *                 message: "¿Y cómo le registro una actividad?"
 *                 conversationId: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Respuesta exitosa con historial
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 response:
 *                   type: string
 *                   description: Respuesta del asistente (considerando el historial)
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     chunksRetrieved:
 *                       type: integer
 *                     intent:
 *                       type: string
 *                       enum: ['how-to', 'data-query', 'general']
 *                     conversationId:
 *                       type: string
 *                       description: ID para usar en próximas preguntas
 *       400:
 *         description: Solicitud inválida
 *       500:
 *         description: Error del servidor
 */
router.post('/ask-history', (req, res) => aiController.askWithHistory(req, res));

router.post('/ask', (req, res) => aiController.ask(req, res));

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat con asistente RAG del CRM (Streaming SSE)
 *     description: Envía una pregunta y recibe la respuesta en streaming SSE (Server-Sent Events). Mejor para clientes que soportan streaming real-time.
 *     tags:
 *       - AI & RAG
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *           example:
 *             message: "¿Cuáles son los endpoints disponibles para gestionar clientes?"
 *     responses:
 *       200:
 *         description: Respuesta en streaming SSE (Server-Sent Events). Los eventos se envían línea por línea. Usar con clientes que soporten SSE.
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: text/event-stream
 *           X-Metadata-Chunks:
 *             schema:
 *               type: integer
 *               description: Número de chunks de contexto recuperados
 *           X-Metadata-Intent:
 *             schema:
 *               type: string
 *               enum: ['how-to', 'data-query', 'general']
 *               description: Intención detectada en la pregunta
 *       400:
 *         description: Mensaje requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/chat', (req, res) => aiController.chat(req, res));

/**
 * @swagger
 * /api/ai/health:
 *   get:
 *     summary: Verificar salud del módulo AI
 *     description: Comprueba que el módulo RAG esté funcionando correctamente
 *     tags:
 *       - AI & RAG
 *     responses:
 *       200:
 *         description: Módulo está en funcionamiento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: ok
 *               module: ai
 *       500:
 *         description: Error en el módulo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/health', (req, res) => aiController.health(req, res));

export default router;
