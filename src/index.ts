import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './interfaces/routes/authRoutes';
import clientRoutes from './interfaces/routes/clientRoutes';
import contactRoutes from './interfaces/routes/contactRoutes';
import opportunityRoutes from './interfaces/routes/opportunityRoutes';
import activityRoutes from './interfaces/routes/activityRoutes';
import dashboardRoutes from './interfaces/routes/dashboardRoutes';
import aiRoutes from './interfaces/routes/aiRoutes';
import { swaggerSpec } from './config/swagger';

const app = express();
const customCss = `
  .swagger-ui .topbar { display: none }
`;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clients', dashboardRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api/docs`);
});

export default app;
