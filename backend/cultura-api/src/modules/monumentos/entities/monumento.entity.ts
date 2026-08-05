import { Column, Entity, Index } from 'typeorm';

import { PatrimonialEntity } from '../../../common/entities/patrimonial.entity';
import { TipoMonumento } from '../enums/tipo-monumento.enum';
import { EstadoMonumento } from '../enums/estado-monumento.enum';

@Entity({
  name: 'monumentos',
})
export class Monumento extends PatrimonialEntity {
  @Index('idx_monumentos_nombre')
  @Index('idx_monumentos_tipo')
  @Column({
    type: 'enum',
    enum: TipoMonumento,
    name: 'tipo',
  })
  declare tipo: TipoMonumento;

  @Column({
    type: 'varchar',
    length: 150,
    name: 'autor',
    nullable: true,
  })
  declare autor: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    name: 'personaje_homenajeado',
    nullable: true,
  })
  declare personajeHomenajeado: string | null;

  @Column({
    type: 'date',
    name: 'fecha_construccion',
    nullable: true,
  })
  declare fechaConstruccion: string | null;

  @Index('idx_monumentos_estado')
  @Column({
    type: 'enum',
    enum: EstadoMonumento,
    name: 'estadoP',
    default: EstadoMonumento.BORRADOR,
  })
  declare estado: EstadoMonumento;
}
