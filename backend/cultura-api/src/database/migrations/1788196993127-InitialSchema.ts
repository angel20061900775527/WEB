import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1788196993127 implements MigrationInterface {
    name = 'InitialSchema1788196993127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."auditorios_estado_registro_enum" AS ENUM('ACTIVO', 'ELIMINADO')`);
        await queryRunner.query(`CREATE TYPE "public"."auditorios_estado_enum" AS ENUM('BORRADOR', 'PUBLICADO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "auditorios" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creador_id" bigint NOT NULL, "usuario_modificador_id" bigint, "usuario_eliminador_id" bigint, "fecha_eliminacion" TIMESTAMP WITH TIME ZONE, "estado_registro" "public"."auditorios_estado_registro_enum" NOT NULL DEFAULT 'ACTIVO', "nombre" character varying(150) NOT NULL, "descripcion" text NOT NULL, "resena_historica" text, "ubicacion" character varying(255) NOT NULL, "latitud" numeric(10,7), "longitud" numeric(10,7), "fuentes_informacion" text, "observaciones" text, "fotografia_principal_id" bigint, "horario_atencion" character varying(255), "responsable" character varying(150), "sitio_web" character varying(500), "estado" "public"."auditorios_estado_enum" NOT NULL DEFAULT 'BORRADOR', CONSTRAINT "PK_2d18ffdd0ad9402734ed0ea13a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_auditorios_estado" ON "auditorios"  ("estado") `);
        await queryRunner.query(`CREATE TYPE "public"."calles_estado_registro_enum" AS ENUM('ACTIVO', 'ELIMINADO')`);
        await queryRunner.query(`CREATE TYPE "public"."calles_estado_enum" AS ENUM('BORRADOR', 'PUBLICADO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "calles" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creador_id" bigint NOT NULL, "usuario_modificador_id" bigint, "usuario_eliminador_id" bigint, "fecha_eliminacion" TIMESTAMP WITH TIME ZONE, "estado_registro" "public"."calles_estado_registro_enum" NOT NULL DEFAULT 'ACTIVO', "nombre" character varying(150) NOT NULL, "descripcion" text NOT NULL, "resena_historica" text, "ubicacion" character varying(255) NOT NULL, "latitud" numeric(10,7), "longitud" numeric(10,7), "fuentes_informacion" text, "observaciones" text, "fotografia_principal_id" bigint, "fecha_denominacion" date, "estado" "public"."calles_estado_enum" NOT NULL DEFAULT 'BORRADOR', "sector" character varying(150), CONSTRAINT "PK_2bd7e8385357dc33e6282938182" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_calles_estado" ON "calles"  ("estado") `);
        await queryRunner.query(`CREATE INDEX "idx_calles_nombre" ON "calles"  ("nombre") `);
        await queryRunner.query(`CREATE TYPE "public"."fotografias_estado_registro_enum" AS ENUM('ACTIVO', 'ELIMINADO')`);
        await queryRunner.query(`CREATE TYPE "public"."fotografias_tipo_patrimonio_enum" AS ENUM('PARQUE', 'CALLE', 'MONUMENTO', 'RIO', 'PLAZA', 'MUSEO', 'AUDITORIO')`);
        await queryRunner.query(`CREATE TABLE "fotografias" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creador_id" bigint NOT NULL, "usuario_modificador_id" bigint, "usuario_eliminador_id" bigint, "fecha_eliminacion" TIMESTAMP WITH TIME ZONE, "estado_registro" "public"."fotografias_estado_registro_enum" NOT NULL DEFAULT 'ACTIVO', "tipo_patrimonio" "public"."fotografias_tipo_patrimonio_enum" NOT NULL, "registro_id" bigint NOT NULL, "nombre_original" character varying(255) NOT NULL, "nombre_archivo" character varying(255) NOT NULL, "mime_type" character varying(100) NOT NULL, "tamanio_bytes" bigint NOT NULL, "ruta" character varying(500) NOT NULL, "descripcion" text, CONSTRAINT "PK_bc80326a39afd067d8fb48208f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_fotografias_patrimonio" ON "fotografias"  ("tipo_patrimonio", "registro_id") `);
        await queryRunner.query(`CREATE TYPE "public"."monumentos_estado_registro_enum" AS ENUM('ACTIVO', 'ELIMINADO')`);
        await queryRunner.query(`CREATE TYPE "public"."monumentos_tipo_enum" AS ENUM('ESTATUA', 'BUSTO', 'ESCULTURA', 'OBELISCO', 'MONOLITO', 'PLACA', 'MEMORIAL', 'FUENTE', 'OTRO')`);
        await queryRunner.query(`CREATE TYPE "public"."monumentos_estadop_enum" AS ENUM('BORRADOR', 'PUBLICADO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "monumentos" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creador_id" bigint NOT NULL, "usuario_modificador_id" bigint, "usuario_eliminador_id" bigint, "fecha_eliminacion" TIMESTAMP WITH TIME ZONE, "estado_registro" "public"."monumentos_estado_registro_enum" NOT NULL DEFAULT 'ACTIVO', "nombre" character varying(150) NOT NULL, "descripcion" text NOT NULL, "resena_historica" text, "ubicacion" character varying(255) NOT NULL, "latitud" numeric(10,7), "longitud" numeric(10,7), "fuentes_informacion" text, "observaciones" text, "fotografia_principal_id" bigint, "tipo" "public"."monumentos_tipo_enum" NOT NULL, "autor" character varying(150), "personaje_homenajeado" character varying(150), "fecha_construccion" date, "estadoP" "public"."monumentos_estadop_enum" NOT NULL DEFAULT 'BORRADOR', CONSTRAINT "PK_e98ae032ef56a2ac5b0b78dba8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_monumentos_tipo" ON "monumentos"  ("tipo") `);
        await queryRunner.query(`CREATE INDEX "idx_monumentos_estado" ON "monumentos"  ("estadoP") `);
        await queryRunner.query(`CREATE INDEX "idx_monumentos_nombre" ON "monumentos"  ("nombre") `);
        await queryRunner.query(`CREATE TYPE "public"."museos_estado_registro_enum" AS ENUM('ACTIVO', 'ELIMINADO')`);
        await queryRunner.query(`CREATE TYPE "public"."museos_estado_enum" AS ENUM('BORRADOR', 'PUBLICADO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "museos" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creador_id" bigint NOT NULL, "usuario_modificador_id" bigint, "usuario_eliminador_id" bigint, "fecha_eliminacion" TIMESTAMP WITH TIME ZONE, "estado_registro" "public"."museos_estado_registro_enum" NOT NULL DEFAULT 'ACTIVO', "nombre" character varying(150) NOT NULL, "descripcion" text NOT NULL, "resena_historica" text, "ubicacion" character varying(255) NOT NULL, "latitud" numeric(10,7), "longitud" numeric(10,7), "fuentes_informacion" text, "observaciones" text, "fotografia_principal_id" bigint, "horario_atencion" character varying(255), "responsable" character varying(150), "sitio_web" character varying(500), "estado" "public"."museos_estado_enum" NOT NULL DEFAULT 'BORRADOR', CONSTRAINT "PK_34b6c91a9bd42e8b15eb1251a4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_museos_estado" ON "museos"  ("estado") `);
        await queryRunner.query(`CREATE TYPE "public"."parques_estado_registro_enum" AS ENUM('ACTIVO', 'ELIMINADO')`);
        await queryRunner.query(`CREATE TYPE "public"."parques_estado_enum" AS ENUM('BORRADOR', 'PUBLICADO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "parques" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creador_id" bigint NOT NULL, "usuario_modificador_id" bigint, "usuario_eliminador_id" bigint, "fecha_eliminacion" TIMESTAMP WITH TIME ZONE, "estado_registro" "public"."parques_estado_registro_enum" NOT NULL DEFAULT 'ACTIVO', "nombre" character varying(150) NOT NULL, "descripcion" text NOT NULL, "resena_historica" text, "ubicacion" character varying(255) NOT NULL, "latitud" numeric(10,7), "longitud" numeric(10,7), "fuentes_informacion" text, "observaciones" text, "fotografia_principal_id" bigint, "fecha_creacion" date, "estado" "public"."parques_estado_enum" NOT NULL DEFAULT 'BORRADOR', CONSTRAINT "PK_68fe41425c0bbbbaad50b439815" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_parques_estado" ON "parques"  ("estado") `);
        await queryRunner.query(`CREATE INDEX "idx_parques_nombre" ON "parques"  ("nombre") `);
        await queryRunner.query(`CREATE TYPE "public"."plazas_estado_registro_enum" AS ENUM('ACTIVO', 'ELIMINADO')`);
        await queryRunner.query(`CREATE TYPE "public"."plazas_estado_enum" AS ENUM('BORRADOR', 'PUBLICADO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "plazas" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creador_id" bigint NOT NULL, "usuario_modificador_id" bigint, "usuario_eliminador_id" bigint, "fecha_eliminacion" TIMESTAMP WITH TIME ZONE, "estado_registro" "public"."plazas_estado_registro_enum" NOT NULL DEFAULT 'ACTIVO', "nombre" character varying(150) NOT NULL, "descripcion" text NOT NULL, "resena_historica" text, "ubicacion" character varying(255) NOT NULL, "latitud" numeric(10,7), "longitud" numeric(10,7), "fuentes_informacion" text, "observaciones" text, "fotografia_principal_id" bigint, "estado" "public"."plazas_estado_enum" NOT NULL DEFAULT 'BORRADOR', "fecha_creacion" date, CONSTRAINT "PK_7ad250b5a156e8fe7f6c9b7bd5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_plazas_estado" ON "plazas"  ("estado") `);
        await queryRunner.query(`CREATE TYPE "public"."rios_estado_registro_enum" AS ENUM('ACTIVO', 'ELIMINADO')`);
        await queryRunner.query(`CREATE TYPE "public"."rios_estado_conservacion_enum" AS ENUM('EXCELENTE', 'BUENO', 'REGULAR', 'DETERIORADO')`);
        await queryRunner.query(`CREATE TYPE "public"."rios_tipo_enum" AS ENUM('PRINCIPAL', 'AFLUENTE', 'QUEBRADA', 'ESTERO')`);
        await queryRunner.query(`CREATE TYPE "public"."rios_estado_enum" AS ENUM('BORRADOR', 'PUBLICADO', 'INACTIVO')`);
        await queryRunner.query(`CREATE TABLE "rios" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "usuario_creador_id" bigint NOT NULL, "usuario_modificador_id" bigint, "usuario_eliminador_id" bigint, "fecha_eliminacion" TIMESTAMP WITH TIME ZONE, "estado_registro" "public"."rios_estado_registro_enum" NOT NULL DEFAULT 'ACTIVO', "nombre" character varying(150) NOT NULL, "descripcion" text NOT NULL, "resena_historica" text, "ubicacion" character varying(255) NOT NULL, "latitud" numeric(10,7), "longitud" numeric(10,7), "fuentes_informacion" text, "observaciones" text, "fotografia_principal_id" bigint, "longitud_km" numeric(10,2), "cuenca_hidrografica" character varying(255), "afluente_de" character varying(255), "estado_conservacion" "public"."rios_estado_conservacion_enum" NOT NULL, "tipo" "public"."rios_tipo_enum" NOT NULL, "apto_balneario" boolean NOT NULL DEFAULT false, "estado" "public"."rios_estado_enum" NOT NULL DEFAULT 'BORRADOR', CONSTRAINT "PK_d0305dbc6a2724893d286ed28b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_rios_estado_conservacion" ON "rios"  ("estado_conservacion") `);
        await queryRunner.query(`CREATE INDEX "idx_rios_tipo" ON "rios"  ("tipo") `);
        await queryRunner.query(`CREATE INDEX "idx_rios_estado" ON "rios"  ("estado") `);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('ADMINISTRADOR', 'CULTURA', 'CONSULTA')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" BIGSERIAL NOT NULL, "fecha_registro" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "username" character varying(80) NOT NULL, "password" character varying(255) NOT NULL, "nombres" character varying(150) NOT NULL, "apellidos" character varying(150) NOT NULL, "email" character varying(150) NOT NULL, "rol" "public"."usuarios_rol_enum" NOT NULL DEFAULT 'CULTURA', "activo" boolean NOT NULL DEFAULT true, "ultimoAcceso" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_9f78cfde576fc28f279e2b7a9cb" UNIQUE ("username"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_usuarios_username" ON "usuarios"  ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_usuarios_email" ON "usuarios"  ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_usuarios_email"`);
        await queryRunner.query(`DROP INDEX "public"."idx_usuarios_username"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_rios_estado"`);
        await queryRunner.query(`DROP INDEX "public"."idx_rios_tipo"`);
        await queryRunner.query(`DROP INDEX "public"."idx_rios_estado_conservacion"`);
        await queryRunner.query(`DROP TABLE "rios"`);
        await queryRunner.query(`DROP TYPE "public"."rios_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rios_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rios_estado_conservacion_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rios_estado_registro_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_plazas_estado"`);
        await queryRunner.query(`DROP TABLE "plazas"`);
        await queryRunner.query(`DROP TYPE "public"."plazas_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."plazas_estado_registro_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_parques_nombre"`);
        await queryRunner.query(`DROP INDEX "public"."idx_parques_estado"`);
        await queryRunner.query(`DROP TABLE "parques"`);
        await queryRunner.query(`DROP TYPE "public"."parques_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."parques_estado_registro_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_museos_estado"`);
        await queryRunner.query(`DROP TABLE "museos"`);
        await queryRunner.query(`DROP TYPE "public"."museos_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."museos_estado_registro_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_monumentos_nombre"`);
        await queryRunner.query(`DROP INDEX "public"."idx_monumentos_estado"`);
        await queryRunner.query(`DROP INDEX "public"."idx_monumentos_tipo"`);
        await queryRunner.query(`DROP TABLE "monumentos"`);
        await queryRunner.query(`DROP TYPE "public"."monumentos_estadop_enum"`);
        await queryRunner.query(`DROP TYPE "public"."monumentos_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."monumentos_estado_registro_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_fotografias_patrimonio"`);
        await queryRunner.query(`DROP TABLE "fotografias"`);
        await queryRunner.query(`DROP TYPE "public"."fotografias_tipo_patrimonio_enum"`);
        await queryRunner.query(`DROP TYPE "public"."fotografias_estado_registro_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_calles_nombre"`);
        await queryRunner.query(`DROP INDEX "public"."idx_calles_estado"`);
        await queryRunner.query(`DROP TABLE "calles"`);
        await queryRunner.query(`DROP TYPE "public"."calles_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."calles_estado_registro_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_auditorios_estado"`);
        await queryRunner.query(`DROP TABLE "auditorios"`);
        await queryRunner.query(`DROP TYPE "public"."auditorios_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."auditorios_estado_registro_enum"`);
    }

}
