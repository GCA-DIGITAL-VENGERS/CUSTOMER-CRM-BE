import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer CRM API',
      version: '1.0.0',
      description: 'API de autenticación y gestión de usuarios con arquitectura hexagonal',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            isActive: {
              type: 'boolean',
              default: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            nombre: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@empresa.com',
            },
            telefono: {
              type: 'string',
              example: '+34912345678',
            },
            empresa: {
              type: 'string',
              example: 'Tech Solutions',
            },
            estado: {
              type: 'string',
              enum: ['ACTIVO', 'INACTIVO'],
              example: 'ACTIVO',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateClientRequest: {
          type: 'object',
          required: ['nombre', 'email', 'telefono', 'empresa'],
          properties: {
            nombre: {
              type: 'string',
              example: 'Juan Pérez',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@empresa.com',
            },
            telefono: {
              type: 'string',
              example: '+34912345678',
            },
            empresa: {
              type: 'string',
              example: 'Tech Solutions',
            },
          },
        },
        UpdateClientRequest: {
          type: 'object',
          properties: {
            nombre: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            telefono: {
              type: 'string',
            },
            empresa: {
              type: 'string',
            },
          },
        },
        Contact: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            clienteId: {
              type: 'string',
              format: 'uuid',
            },
            nombre: {
              type: 'string',
              example: 'María García',
            },
            cargo: {
              type: 'string',
              example: 'Gerente de Ventas',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@empresa.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateContactRequest: {
          type: 'object',
          required: ['clienteId', 'nombre', 'cargo', 'email'],
          properties: {
            clienteId: {
              type: 'string',
              format: 'uuid',
            },
            nombre: {
              type: 'string',
              example: 'María García',
            },
            cargo: {
              type: 'string',
              example: 'Gerente de Ventas',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@empresa.com',
            },
          },
        },
        Opportunity: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            clienteId: {
              type: 'string',
              format: 'uuid',
            },
            titulo: {
              type: 'string',
              example: 'Implementación sistema ERP',
            },
            valor: {
              type: 'number',
              example: 50000,
            },
            etapa: {
              type: 'string',
              enum: ['PROSPECCION', 'PROPUESTA', 'NEGOCIACION', 'CERRADA'],
              example: 'PROSPECCION',
            },
            fechaCierre: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateOpportunityRequest: {
          type: 'object',
          required: ['clienteId', 'titulo', 'valor', 'fechaCierre'],
          properties: {
            clienteId: {
              type: 'string',
              format: 'uuid',
            },
            titulo: {
              type: 'string',
              example: 'Implementación sistema ERP',
            },
            valor: {
              type: 'number',
              example: 50000,
            },
            fechaCierre: {
              type: 'string',
              format: 'date-time',
              example: '2026-12-31T23:59:59Z',
            },
          },
        },
        UpdateOpportunityStageRequest: {
          type: 'object',
          required: ['etapa'],
          properties: {
            etapa: {
              type: 'string',
              enum: ['PROSPECCION', 'PROPUESTA', 'NEGOCIACION', 'CERRADA'],
              example: 'PROPUESTA',
            },
          },
        },
        Activity: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            clienteId: {
              type: 'string',
              format: 'uuid',
            },
            tipo: {
              type: 'string',
              enum: ['LLAMADA', 'REUNION', 'CORREO', 'NOTA'],
              example: 'LLAMADA',
            },
            descripcion: {
              type: 'string',
              example: 'Llamada de seguimiento de la propuesta',
            },
            fecha: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateActivityRequest: {
          type: 'object',
          required: ['clienteId', 'tipo', 'descripcion', 'fecha'],
          properties: {
            clienteId: {
              type: 'string',
              format: 'uuid',
            },
            tipo: {
              type: 'string',
              enum: ['LLAMADA', 'REUNION', 'CORREO', 'NOTA'],
              example: 'LLAMADA',
            },
            descripcion: {
              type: 'string',
              example: 'Llamada de seguimiento de la propuesta',
            },
            fecha: {
              type: 'string',
              format: 'date-time',
              example: '2026-05-15T14:30:00Z',
            },
          },
        },
        DashboardSummary: {
          type: 'object',
          properties: {
            totalActiveClients: {
              type: 'integer',
              example: 45,
              description: 'Total de clientes activos',
            },
            openOpportunities: {
              type: 'integer',
              example: 23,
              description: 'Total de oportunidades abiertas (no CERRADA)',
            },
            totalPipelineValue: {
              type: 'number',
              example: 1250000,
              description: 'Valor total del pipeline en unidades monetarias',
            },
            averageDealSize: {
              type: 'number',
              example: 54347.83,
              description: 'Valor promedio por oportunidad abierta',
            },
            opportunitiesByStage: {
              type: 'object',
              properties: {
                PROSPECCION: {
                  type: 'integer',
                  example: 8,
                },
                PROPUESTA: {
                  type: 'integer',
                  example: 7,
                },
                NEGOCIACION: {
                  type: 'integer',
                  example: 5,
                },
                CERRADA: {
                  type: 'integer',
                  example: 12,
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/interfaces/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
