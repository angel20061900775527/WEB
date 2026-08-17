import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParquesModule } from './modules/parques/parques.module';
import { CallesModule } from './modules/calles/calles.module';
import { MonumentosModule } from './modules/monumentos/monumentos.module';
import { RiosModule } from './modules/rios/rios.module';
import { PlazasModule } from './modules/plazas/plazas.module';
import { MuseosModule } from './modules/museos/museos.module';
import { AuditoriosModule } from './modules/auditorios/auditorios.module';
import { AuthModule } from './modules/auth/auth.module';

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
    RiosModule,
    PlazasModule,
    MuseosModule,
    AuditoriosModule,
    UsuariosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
