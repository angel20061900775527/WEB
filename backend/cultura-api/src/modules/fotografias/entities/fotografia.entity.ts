import { Column, Entity, Index } from 'typeorm';

import { AuditableEntity } from '../../../common/entities/auditable.entity';
import { TipoPatrimonio } from '../enums/tipo-patrimonio.enum';

@Entity({
  name: 'fotografias',
})
@Index('idx_fotografias_patrimonio', ['tipoPatrimonio', 'registroId'])
export class Fotografia extends AuditableEntity {
  @Column({
    type: 'enum',
    enum: TipoPatrimonio,
    name: 'tipo_patrimonio',
  })
  declare tipoPatrimonio: TipoPatrimonio;

  @Column({
    type: 'bigint',
    name: 'registro_id',
  })
  declare registroId: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'nombre_original',
  })
  declare nombreOriginal: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'nombre_archivo',
  })
  declare nombreArchivo: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'mime_type',
  })
  declare mimeType: string;

  @Column({
    type: 'bigint',
    name: 'tamanio_bytes',
  })
  declare tamanioBytes: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'ruta',
  })
  declare ruta: string;

  @Column({
    type: 'text',
    name: 'descripcion',
    nullable: true,
  })
  declare descripcion: string | null;
}
