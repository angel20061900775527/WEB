import { Column, Entity, Index } from 'typeorm';

import { PatrimonialEntity } from '../../../common/entities/patrimonial.entity';
import { EstadoMuseo } from '../enums/estado-museo.enum';

@Entity({
  name: 'museos',
})
export class Museo extends PatrimonialEntity {
  @Column({
    type: 'varchar',
    length: 255,
    name: 'horario_atencion',
    nullable: true,
  })
  declare horarioAtencion: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    name: 'responsable',
    nullable: true,
  })
  declare responsable: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'sitio_web',
    nullable: true,
  })
  declare sitioWeb: string | null;

  @Index('idx_museos_estado')
  @Column({
    type: 'enum',
    enum: EstadoMuseo,
    name: 'estado',
    default: EstadoMuseo.BORRADOR,
  })
  declare estado: EstadoMuseo;
}
