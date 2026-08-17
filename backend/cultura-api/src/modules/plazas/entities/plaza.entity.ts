import { Column, Entity, Index } from 'typeorm';

import { PatrimonialEntity } from '../../../common/entities/patrimonial.entity';
import { EstadoPlaza } from '../enums/estado-plaza.enum';

@Entity({
  name: 'plazas',
})
export class Plaza extends PatrimonialEntity {
  @Index('idx_plazas_estado')
  @Column({
    type: 'enum',
    enum: EstadoPlaza,
    name: 'estado',
    default: EstadoPlaza.BORRADOR,
  })
  declare estado: EstadoPlaza;

  @Column({
    type: 'date',
    name: 'fecha_creacion',
    nullable: true,
  })
  declare fechaCreacion: string | null;
}
