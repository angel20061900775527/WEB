import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { EstadoRegistro } from '../../common/enums/estado-registro.enum';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';
import { validateHistoricalDate } from '../../common/utils/date-validation.util';
import { CreateMonumentoDto } from './dto/request/create-monumento.dto';
import { UpdateEstadoMonumentoDto } from './dto/request/update-estado-monumento.dto';
import { UpdateMonumentoDto } from './dto/request/update-monumento.dto';
import { MonumentoResponseDto } from './dto/response/monumento-response.dto';
import { Monumento } from './entities/monumento.entity';

@Injectable()
export class MonumentosService extends BasePatrimonialService<Monumento> {
  constructor(
    @InjectRepository(Monumento)
    private readonly monumentosRepository: Repository<Monumento>,
  ) {
    super(monumentosRepository, 'monumento');
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page;
    const limit = query.limit;

    const where: FindOptionsWhere<Monumento> = {
      estadoRegistro: EstadoRegistro.ACTIVO,
    };

    if (query.search) {
      where.nombre = ILike(`%${query.search.trim()}%`);
    }

    const [monumentos, total] = await this.monumentosRepository.findAndCount({
      where,
      order: {
        nombre: query.order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      monumentos: monumentos.map((monumento) =>
        MonumentoResponseDto.fromEntity(monumento),
      ),
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }

  async findById(id: number): Promise<MonumentoResponseDto> {
    const monumento = await this.findEntityById(id);

    return MonumentoResponseDto.fromEntity(monumento);
  }

  async create(
    createMonumentoDto: CreateMonumentoDto,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    validateHistoricalDate(
      createMonumentoDto.fechaConstruccion,
      'La fecha de construcción',
    );

    const nombreNormalizado = createMonumentoDto.nombre.trim();

    await this.validateUniqueName(nombreNormalizado);

    const monumento = this.monumentosRepository.create({
      ...createMonumentoDto,
      nombre: nombreNormalizado,
      descripcion: createMonumentoDto.descripcion.trim(),
      autor: createMonumentoDto.autor?.trim() || null,
      personajeHomenajeado:
        createMonumentoDto.personajeHomenajeado?.trim() || null,
      resenaHistorica: createMonumentoDto.resenaHistorica?.trim() || null,
      fechaConstruccion: createMonumentoDto.fechaConstruccion ?? null,
      ubicacion: createMonumentoDto.ubicacion.trim(),
      latitud: createMonumentoDto.latitud ?? null,
      longitud: createMonumentoDto.longitud ?? null,
      fuentesInformacion: createMonumentoDto.fuentesInformacion?.trim() || null,
      observaciones: createMonumentoDto.observaciones?.trim() || null,
      usuarioCreadorId: '1',
    });

    const monumentoGuardado = await this.monumentosRepository.save(monumento);

    return new ApiResponseDto(
      'Monumento registrado correctamente.',
      MonumentoResponseDto.fromEntity(monumentoGuardado),
    );
  }

  async update(
    id: number,
    updateMonumentoDto: UpdateMonumentoDto,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    const monumento = await this.findEntityById(id);

    if (updateMonumentoDto.nombre !== undefined) {
      const nombreNormalizado = updateMonumentoDto.nombre.trim();

      await this.validateUniqueName(nombreNormalizado, id);

      monumento.nombre = nombreNormalizado;
    }

    if (updateMonumentoDto.descripcion !== undefined) {
      monumento.descripcion = updateMonumentoDto.descripcion.trim();
    }

    if (updateMonumentoDto.tipo !== undefined) {
      monumento.tipo = updateMonumentoDto.tipo;
    }

    if (updateMonumentoDto.autor !== undefined) {
      monumento.autor = updateMonumentoDto.autor?.trim() || null;
    }

    if (updateMonumentoDto.personajeHomenajeado !== undefined) {
      monumento.personajeHomenajeado =
        updateMonumentoDto.personajeHomenajeado?.trim() || null;
    }

    if (updateMonumentoDto.resenaHistorica !== undefined) {
      monumento.resenaHistorica =
        updateMonumentoDto.resenaHistorica?.trim() || null;
    }

    if (updateMonumentoDto.fechaConstruccion !== undefined) {
      validateHistoricalDate(
        updateMonumentoDto.fechaConstruccion,
        'La fecha de construcción',
      );

      monumento.fechaConstruccion =
        updateMonumentoDto.fechaConstruccion ?? null;
    }

    if (updateMonumentoDto.ubicacion !== undefined) {
      monumento.ubicacion = updateMonumentoDto.ubicacion.trim();
    }

    if (updateMonumentoDto.latitud !== undefined) {
      monumento.latitud = updateMonumentoDto.latitud ?? null;
    }

    if (updateMonumentoDto.longitud !== undefined) {
      monumento.longitud = updateMonumentoDto.longitud ?? null;
    }

    if (updateMonumentoDto.fuentesInformacion !== undefined) {
      monumento.fuentesInformacion =
        updateMonumentoDto.fuentesInformacion?.trim() || null;
    }

    if (updateMonumentoDto.observaciones !== undefined) {
      monumento.observaciones =
        updateMonumentoDto.observaciones?.trim() || null;
    }

    monumento.usuarioModificadorId = '1';

    const monumentoActualizado =
      await this.monumentosRepository.save(monumento);

    return new ApiResponseDto(
      'Monumento actualizado correctamente.',
      MonumentoResponseDto.fromEntity(monumentoActualizado),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoMonumentoDto: UpdateEstadoMonumentoDto,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    const monumento = await this.findEntityById(id);

    monumento.estado = updateEstadoMonumentoDto.estado;
    monumento.usuarioModificadorId = '1';

    const monumentoActualizado =
      await this.monumentosRepository.save(monumento);

    return new ApiResponseDto(
      'Estado del monumento actualizado correctamente.',
      MonumentoResponseDto.fromEntity(monumentoActualizado),
    );
  }

  async delete(id: number): Promise<ApiResponseDto<null>> {
    const monumento = await this.findEntityById(id);

    monumento.estadoRegistro = EstadoRegistro.ELIMINADO;
    monumento.fechaEliminacion = new Date();
    monumento.usuarioEliminadorId = '1';

    await this.monumentosRepository.save(monumento);

    return new ApiResponseDto('Monumento eliminado correctamente.', null);
  }

  async restore(id: number): Promise<ApiResponseDto<MonumentoResponseDto>> {
    const monumento = await this.findDeletedEntityById(id);

    await this.validateUniqueName(monumento.nombre);

    monumento.estadoRegistro = EstadoRegistro.ACTIVO;
    monumento.fechaEliminacion = null;
    monumento.usuarioEliminadorId = null;
    monumento.usuarioModificadorId = '1';

    const monumentoRestaurado = await this.monumentosRepository.save(monumento);

    return new ApiResponseDto(
      'Monumento restaurado correctamente.',
      MonumentoResponseDto.fromEntity(monumentoRestaurado),
    );
  }
}
