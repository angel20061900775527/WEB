import { Column, Entity, Index } from 'typeorm';

import { PatrimonialEntity } from '../../../common/entities/patrimonial.entity';
import { EstadoAuditorio } from '../enums/estado-auditorio.enum';

@Entity({
  name: 'auditorios',
})
export class Auditorio extends PatrimonialEntity {
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

  @Index('idx_auditorios_estado')
  @Column({
    type: 'enum',
    enum: EstadoAuditorio,
    name: 'estado',
    default: EstadoAuditorio.BORRADOR,
  })
  declare estado: EstadoAuditorio;
}
