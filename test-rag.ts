/**
 * Script de prueba para el módulo RAG
 * Ejecutar con: npm run dev (en otra terminal)
 * Luego en otra terminal: npx ts-node test-rag.ts
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:7000/api/ai';

const testQueries = [
  '¿Cuáles son los endpoints para gestionar clientes?',
  'Cómo crear una nueva oportunidad',
  '¿Qué métricas proporciona el dashboard?',
  '¿Cómo registrar una actividad?',
  'Explícame el proceso para crear un cliente',
];

async function testRAG(query: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`📝 Pregunta: ${query}`);
  console.log('='.repeat(80));

  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: query }),
    });

    if (!response.ok) {
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      const errorData = await response.text();
      console.error('Response:', errorData);
      return;
    }

    const chunksRetrieved = response.headers.get('x-metadata-chunks');
    const intent = response.headers.get('x-metadata-intent');

    console.log(`\n📊 Metadata:`);
    console.log(`   • Chunks recuperados: ${chunksRetrieved}`);
    console.log(`   • Intención detectada: ${intent}`);
    console.log(`\n🤖 Respuesta:`);
    console.log('-'.repeat(80));

    const reader = (response.body as any).getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr);
            if (data.type === 'metadata') {
              continue;
            } else if (data.type === 'done') {
              continue;
            } else if (data.type === 'error') {
              console.error(`❌ Error: ${data.message}`);
            }
          } catch {
            process.stdout.write(dataStr);
          }
        }
      }

      buffer = lines[lines.length - 1];
    }

    console.log('\n' + '-'.repeat(80));
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function testHealth() {
  console.log('\n' + '='.repeat(80));
  console.log('🏥 Verificando salud del módulo...');
  console.log('='.repeat(80));

  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = (await response.json()) as { status: string; module: string };
    console.log(`✅ Status: ${data.status}`);
    console.log(`📦 Módulo: ${data.module}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas del módulo RAG...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('Asegúrate de que el servidor esté ejecutándose (npm run dev)\n');

  await testHealth();

  for (const query of testQueries) {
    await testRAG(query);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Pruebas completadas');
  console.log('='.repeat(80));
}

main().catch(console.error);
