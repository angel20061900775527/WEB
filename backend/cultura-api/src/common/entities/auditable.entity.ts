import { Column } from 'typeorm';

import { BaseEntity } from './base.entity';
import { EstadoRegistro } from '../enums/estado-registro.enum';

export abstract class AuditableEntity extends BaseEntity {
  @Column({
    type: 'bigint',
    name: 'usuario_creador_id',
  })
  usuarioCreadorId!: string;

  @Column({
    type: 'bigint',
    name: 'usuario_modificador_id',
    nullable: true,
  })
  declare usuarioModificadorId: string | null;

  @Column({
    type: 'bigint',
    name: 'usuario_eliminador_id',
    nullable: true,
  })
  declare usuarioEliminadorId: string | null;

  @Column({
    type: 'timestamp with time zone',
    name: 'fecha_eliminacion',
    nullable: true,
  })
  declare fechaEliminacion: Date | null;

  @Column({
    type: 'enum',
    enum: EstadoRegistro,
    name: 'estado_registro',
    default: EstadoRegistro.ACTIVO,
  })
  declare estadoRegistro: EstadoRegistro;
}
