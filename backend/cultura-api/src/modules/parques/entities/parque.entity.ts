import { Column, Entity, Index } from 'typeorm';

import { AuditableEntity } from '../../../common/entities/auditable.entity';
import { EstadoParque } from '../enums/estado-parque.enum';

@Entity({
  name: 'parques',
})
export class Parque extends AuditableEntity {
  @Index('idx_parques_nombre')
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
    type: 'date',
    name: 'fecha_creacion',
    nullable: true,
  })
  declare fechaCreacion: string | null;

  @Index('idx_parques_estado')
  @Column({
    type: 'enum',
    enum: EstadoParque,
    name: 'estado',
    default: EstadoParque.BORRADOR,
  })
  declare estado: EstadoParque;

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

  /*
   * Se reemplazará por una relación cuando se implemente
   * la entidad FotografiaParque.
   */
  @Column({
    type: 'bigint',
    name: 'fotografia_principal_id',
    nullable: true,
  })
  declare fotografiaPrincipalId: string | null;
}
