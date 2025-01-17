import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'ormconfig';
import { CategoriesModule } from './categories/categories.module';

/* Creating rabbitmq service that can be used in other modules. */
const RabbitMQService = {
  provide: 'NOTIFY_SERVICE',
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBITMQ_URL')],
        queue: configService.get<string>('RABBITMQ_QUEUE'),
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
};
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ProfileModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMQService],
  exports: [RabbitMQService],
})
export class AppModule {}
