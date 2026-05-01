import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './interfaces/routes/authRoutes';
import clientRoutes from './interfaces/routes/clientRoutes';
import { swaggerSpec } from './config/swagger';

const app = express();
const customCss = `
  .swagger-ui .topbar { display: none }
`;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api/docs`);
});

export default app;
