import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { corsOrigin } from './config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  });

  const port = Number(process.env.PORT || 5001);
  await app.listen(port);

  console.log(`Server has started on port ${port}.`);
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
