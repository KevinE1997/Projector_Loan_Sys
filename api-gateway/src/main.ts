import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Identity Service (Auth y Users)
  // Usamos app.use() global, pero filtramos adentro con pathFilter
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathFilter: ['/api/users', '/api/auth'], // <--- AQUÍ ESTÁ EL CAMBIO
    })
  );

  // 2. Inventory Service
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
      pathFilter: ['/api/projectors'], // <--- AQUÍ TAMBIÉN
    })
  );

  // 3. Loan Service
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:3004',
      changeOrigin: true,
      pathFilter: ['/api/loans'], // <--- Y AQUÍ
    })
  );

  // 4. Feedback Service
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:3008', // Puerto del Feedback Service
      changeOrigin: true,
      pathFilter: ['/api/feedback'],
    })
  );

  // 5. Penalty Service
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:3016', // Puerto del Penalty Service
      changeOrigin: true,
      pathFilter: ['/api/penalty'],
    })
  );


  const port = 8000;
  await app.listen(port);
  console.log(`🚀 API Gateway corriendo en: http://localhost:${port}`);
}

bootstrap();