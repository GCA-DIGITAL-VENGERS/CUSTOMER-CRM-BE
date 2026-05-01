#!/bin/bash

echo "Limpiando node_modules/.prisma..."
rm -rf node_modules/.prisma

echo "Regenerando cliente Prisma..."
npx prisma generate

echo "Creando migración..."
npx prisma migrate dev --name add_chat_history

echo "✅ Migración completada"
