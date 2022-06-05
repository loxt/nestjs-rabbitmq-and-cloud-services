import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger: Logger = new Logger('Microservice');
async function bootstrap() {
  const app = await NestFactory.createMicroservice<RmqOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:QtJFBU8LdY2P@3.95.238.78/smartranking'],
      noAck: false,
      queue: 'admin-backend',
    },
  });
  await app.listen();
}
bootstrap().then(() => logger.log('Microservice is listening...'));
