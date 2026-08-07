import { 
  FindOptionsOrder, 
  FindOptionsWhere, 
  ILike, 
  Not, 
  Repository,
} from 'typeorm';

import { PaginationQueryDto } from '../dto/request/pagination-query.dto';
import { PatrimonialEntity } from '../entities/patrimonial.entity';
import { EstadoRegistro } from '../enums/estado-registro.enum';
import { BaseCatalogService } from './base-catalog.service';
import { ConflictException } from '@nestjs/common';

export interface PatrimonialListResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BasePatrimonialService<
  TEntity extends PatrimonialEntity,
> extends BaseCatalogService<TEntity> {
  constructor(repository: Repository<TEntity>, entityName: string) {
    super(repository, entityName);
  }

  protected async findAllActive<TResponse>(
    query: PaginationQueryDto,
    mapper: (entity: TEntity) => TResponse,
  ): Promise<PatrimonialListResult<TResponse>> {
    const page = query.page;
    const limit = query.limit;

    const where = {
      estadoRegistro: EstadoRegistro.ACTIVO,
    } as FindOptionsWhere<TEntity>;

    if (query.search) {
      Object.assign(where, {
        nombre: ILike(`%${query.search.trim()}%`),
      });
    }

    const order = {
      nombre: query.order,
    } as FindOptionsOrder<TEntity>;

    const [entities, total] = await this.repository.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: entities.map(mapper),
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }
  protected async validateUniqueName(
    nombre: string,
    idExcluir?: number,
  ): Promise<void> {
    const where = {
      nombre: ILike(nombre),
      estadoRegistro: EstadoRegistro.ACTIVO,
    } as FindOptionsWhere<TEntity>;

    if (idExcluir !== undefined) {
      Object.assign(where, {
        id: Not(idExcluir),
      });
    }

    const entity = await this.repository.findOne({
      where,
    });

    if (entity) {
      throw new ConflictException(
        `Ya existe un ${this.entityName} activo registrado con ese nombre.`,
      );
    }
  }
  protected async softDeleteEntity(
    id: number,
    usuarioEliminadorId: string,
  ): Promise<void> {
    const entity = await this.findEntityById(id);

    entity.estadoRegistro = EstadoRegistro.ELIMINADO;
    entity.fechaEliminacion = new Date();
    entity.usuarioEliminadorId = usuarioEliminadorId;

    await this.repository.save(entity);
  }

  protected async restoreEntity(
    id: number,
    usuarioModificadorId: string,
  ): Promise<TEntity> {
    const entity = await this.findDeletedEntityById(id);

    await this.validateUniqueName(entity.nombre);

    entity.estadoRegistro = EstadoRegistro.ACTIVO;
    entity.fechaEliminacion = null;
    entity.usuarioEliminadorId = null;
    entity.usuarioModificadorId = usuarioModificadorId;

    return this.repository.save(entity);
  }
}
