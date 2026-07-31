import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  declare id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'fecha_registro',
  })
  fechaRegistro!: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'fecha_modificacion',
  })
  fechaModificacion!: Date;
}
