import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParquesModule } from './modules/parques/parques.module';
import { CallesModule } from './modules/calles/calles.module';
import { MonumentosModule } from './modules/monumentos/monumentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_DATABASE'),

        autoLoadEntities: true,

        /*
         * La estructura de la base de datos se administrará
         * mediante migraciones de TypeORM.
         */
        synchronize: true,

        logging: false,
      }),
    }),

    ParquesModule,
    CallesModule,
    MonumentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
