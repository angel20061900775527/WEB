import { NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';

import { EstadoRegistro } from '../enums/estado-registro.enum';
import { AuditableEntity } from '../entities/auditable.entity';

export abstract class BaseCatalogService<TEntity extends AuditableEntity> {
  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly entityName: string,
  ) {}

  protected async findEntity(
    id: number,
    estadoRegistro: EstadoRegistro,
  ): Promise<TEntity> {
    const entity = await this.repository.findOne({
      where: {
        id,
        estadoRegistro,
      } as FindOptionsWhere<TEntity>,
    });

    if (!entity) {
      const estado =
        estadoRegistro === EstadoRegistro.ACTIVO ? 'activo' : 'eliminado';

      throw new NotFoundException(
        `No se encontró un ${this.entityName} ${estado} con el identificador ${id}.`,
      );
    }

    return entity;
  }

  protected async findEntityById(id: number): Promise<TEntity> {
    return this.findEntity(id, EstadoRegistro.ACTIVO);
  }

  protected async findDeletedEntityById(id: number): Promise<TEntity> {
    return this.findEntity(id, EstadoRegistro.ELIMINADO);
  }
}
