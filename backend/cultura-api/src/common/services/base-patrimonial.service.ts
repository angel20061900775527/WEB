import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
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

    const alias = 'patrimonial';

    const queryBuilder = this.repository
      .createQueryBuilder(alias)
      .where(`${alias}.estadoRegistro = :estadoRegistro`, {
        estadoRegistro: EstadoRegistro.ACTIVO,
      });

    if (query.estado) {
      queryBuilder.andWhere(`${alias}.estado = :estado`, {
        estado: query.estado,
      });
    }

    const search = query.search?.trim();

    if (search) {
      queryBuilder.andWhere(
        `(
        ${alias}.nombre ILIKE :search
        OR ${alias}.descripcion ILIKE :search
        OR ${alias}.resenaHistorica ILIKE :search
        OR ${alias}.ubicacion ILIKE :search
        OR ${alias}.fuentesInformacion ILIKE :search
        OR ${alias}.observaciones ILIKE :search
      )`,
        {
          search: `%${search}%`,
        },
      );
    }

    queryBuilder
      .orderBy(`${alias}.nombre`, query.order)
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

    return {
      items: entities.map(mapper),
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }
  protected async findAllDeleted<TResponse>(
    query: PaginationQueryDto,
    mapper: (entity: TEntity) => TResponse,
  ): Promise<PatrimonialListResult<TResponse>> {
    const page = query.page;
    const limit = query.limit;

    const alias = 'patrimonial';

    const queryBuilder = this.repository
      .createQueryBuilder(alias)
      .where(`${alias}.estadoRegistro = :estadoRegistro`, {
        estadoRegistro: EstadoRegistro.ELIMINADO,
      });

    const search = query.search?.trim();

    if (search) {
      queryBuilder.andWhere(
        `(
        ${alias}.nombre ILIKE :search
        OR ${alias}.descripcion ILIKE :search
        OR ${alias}.resenaHistorica ILIKE :search
        OR ${alias}.ubicacion ILIKE :search
        OR ${alias}.fuentesInformacion ILIKE :search
        OR ${alias}.observaciones ILIKE :search
      )`,
        {
          search: `%${search}%`,
        },
      );
    }

    queryBuilder
      .orderBy(`${alias}.nombre`, query.order)
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

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
