import { Column, Entity, Index } from 'typeorm';

import { PatrimonialEntity } from '../../../common/entities/patrimonial.entity';

import { EstadoParque } from '../enums/estado-parque.enum';

@Entity({
  name: 'parques',
})
@Index('idx_parques_nombre', ['nombre'])
export class Parque extends PatrimonialEntity {
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
}
