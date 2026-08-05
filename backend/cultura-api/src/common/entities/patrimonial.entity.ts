import { Column } from 'typeorm';

import { AuditableEntity } from './auditable.entity';

export abstract class PatrimonialEntity extends AuditableEntity {
  @Column({
    type: 'varchar',
    length: 150,
    name: 'nombre',
  })
  declare nombre: string;

  @Column({
    type: 'text',
    name: 'descripcion',
  })
  declare descripcion: string;

  @Column({
    type: 'text',
    name: 'resena_historica',
    nullable: true,
  })
  declare resenaHistorica: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'ubicacion',
  })
  declare ubicacion: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 7,
    name: 'latitud',
    nullable: true,
    transformer: {
      to: (value: number | null): number | null => value,
      from: (value: string | null): number | null =>
        value === null ? null : Number(value),
    },
  })
  declare latitud: number | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 7,
    name: 'longitud',
    nullable: true,
    transformer: {
      to: (value: number | null): number | null => value,
      from: (value: string | null): number | null =>
        value === null ? null : Number(value),
    },
  })
  declare longitud: number | null;

  @Column({
    type: 'text',
    name: 'fuentes_informacion',
    nullable: true,
  })
  declare fuentesInformacion: string | null;

  @Column({
    type: 'text',
    name: 'observaciones',
    nullable: true,
  })
  declare observaciones: string | null;

  @Column({
    type: 'bigint',
    name: 'fotografia_principal_id',
    nullable: true,
  })
  declare fotografiaPrincipalId: string | null;
}
