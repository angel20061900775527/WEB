import { Column, Entity, Index } from 'typeorm';

import { PatrimonialEntity } from '../../../common/entities/patrimonial.entity';
import { EstadoConservacionRio } from '../enums/estado-conservacion-rio.enum';
import { EstadoRio } from '../enums/estado-rio.enum';
import { TipoRio } from '../enums/tipo-rio.enum';

@Entity({
  name: 'rios',
})
export class Rio extends PatrimonialEntity {
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    name: 'longitud_km',
    nullable: true,
    transformer: {
      to: (value: number | null): number | null => value,
      from: (value: string | null): number | null =>
        value === null ? null : Number(value),
    },
  })
  declare longitudKm: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'cuenca_hidrografica',
    nullable: true,
  })
  declare cuencaHidrografica: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'afluente_de',
    nullable: true,
  })
  declare afluenteDe: string | null;

  @Index('idx_rios_estado_conservacion')
  @Column({
    type: 'enum',
    enum: EstadoConservacionRio,
    name: 'estado_conservacion',
  })
  declare estadoConservacion: EstadoConservacionRio;

  @Index('idx_rios_tipo')
  @Column({
    type: 'enum',
    enum: TipoRio,
    name: 'tipo',
  })
  declare tipo: TipoRio;

  @Column({
    type: 'boolean',
    name: 'apto_balneario',
    default: false,
  })
  declare aptoBalneario: boolean;

  @Index('idx_rios_estado')
  @Column({
    type: 'enum',
    enum: EstadoRio,
    name: 'estado',
    default: EstadoRio.BORRADOR,
  })
  declare estado: EstadoRio;
}
