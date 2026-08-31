import { Column, Entity, Index } from 'typeorm';

import { PatrimonialEntity } from '../../../common/entities/patrimonial.entity';

import { EstadoCalle } from '../enums/estado-calle.enum';

@Entity({
  name: 'calles',
})
@Index('idx_calles_nombre', ['nombre'])
export class Calle extends PatrimonialEntity {
  @Column({
    type: 'date',
    name: 'fecha_denominacion',
    nullable: true,
  })
  declare fechaDenominacion: string | null;

  @Index('idx_calles_estado')
  @Column({
    type: 'enum',
    enum: EstadoCalle,
    name: 'estado',
    default: EstadoCalle.BORRADOR,
  })
  declare estado: EstadoCalle;

  @Column({
    type: 'varchar',
    length: 150,
    name: 'sector',
    nullable: true,
  })
  declare sector: string | null;
}
