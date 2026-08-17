import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '../../../common/entities/base.entity';
import { RolUsuario } from '../enums/rol-usuario.enum';

@Entity({
  name: 'usuarios',
})
export class Usuario extends BaseEntity {
  @Index('idx_usuarios_username', {
    unique: true,
  })
  @Column({
    type: 'varchar',
    length: 80,
    unique: true,
  })
  declare username: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  declare password: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  declare nombres: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  declare apellidos: string;

  @Index('idx_usuarios_email', {
    unique: true,
  })
  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  declare email: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.CULTURA,
  })
  declare rol: RolUsuario;

  @Column({
    type: 'boolean',
    default: true,
  })
  declare activo: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  declare ultimoAcceso: Date | null;
}
