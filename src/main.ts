import 'dotenv/config'; // Load env vars
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: ['http://localhost:3000'], 
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((err) =>
          err.constraints ? Object.values(err.constraints).join(', ') : 'Invalid input',
        );
        return new BadRequestException(messages.join(' | '));
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(` Server running at http://localhost:${port}/graphql`);
}

bootstrap();
