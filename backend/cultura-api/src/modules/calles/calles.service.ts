import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';
import { validateHistoricalDate } from '../../common/utils/date-validation.util';
import { CreateCalleDto } from './dto/request/create-calle.dto';
import { UpdateCalleDto } from './dto/request/update-calle.dto';
import { UpdateEstadoCalleDto } from './dto/request/update-estado-calle.dto';
import { CalleResponseDto } from './dto/response/calle-response.dto';
import { Calle } from './entities/calle.entity';

@Injectable()
export class CallesService extends BasePatrimonialService<Calle> {
  constructor(
    @InjectRepository(Calle)
    private readonly callesRepository: Repository<Calle>,
  ) {
    super(callesRepository, 'calle');
  }

  async findAll(query: PaginationQueryDto) {
    const result = await this.findAllActive(query, (calle) =>
      CalleResponseDto.fromEntity(calle),
    );

    return {
      calles: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findDeleted(query: PaginationQueryDto) {
    const result = await this.findAllDeleted(query, (calle) =>
      CalleResponseDto.fromEntity(calle),
    );

    return {
      calles: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findById(id: number): Promise<CalleResponseDto> {
    const calle = await this.findEntityById(id);

    return CalleResponseDto.fromEntity(calle);
  }

  async create(
    createCalleDto: CreateCalleDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    validateHistoricalDate(
      createCalleDto.fechaDenominacion,
      'La fecha de denominación',
    );

    const nombreNormalizado = createCalleDto.nombre.trim();

    await this.validateUniqueName(nombreNormalizado);

    const calle = this.callesRepository.create({
      ...createCalleDto,

      nombre: nombreNormalizado,

      descripcion: createCalleDto.descripcion.trim(),

      resenaHistorica: createCalleDto.resenaHistorica?.trim() || null,

      fechaDenominacion: createCalleDto.fechaDenominacion ?? null,

      ubicacion: createCalleDto.ubicacion.trim(),

      sector: createCalleDto.sector?.trim() || null,

      latitud: createCalleDto.latitud ?? null,

      longitud: createCalleDto.longitud ?? null,

      fuentesInformacion: createCalleDto.fuentesInformacion?.trim() || null,

      observaciones: createCalleDto.observaciones?.trim() || null,

      usuarioCreadorId: String(usuarioId),
    });

    const calleGuardada = await this.callesRepository.save(calle);

    return new ApiResponseDto(
      'Calle registrada correctamente.',
      CalleResponseDto.fromEntity(calleGuardada),
    );
  }

  async update(
    id: number,
    updateCalleDto: UpdateCalleDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    const calle = await this.findEntityById(id);

    if (updateCalleDto.nombre !== undefined) {
      const nombreNormalizado = updateCalleDto.nombre.trim();

      await this.validateUniqueName(nombreNormalizado, id);

      calle.nombre = nombreNormalizado;
    }

    if (updateCalleDto.descripcion !== undefined) {
      calle.descripcion = updateCalleDto.descripcion.trim();
    }

    if (updateCalleDto.resenaHistorica !== undefined) {
      calle.resenaHistorica = updateCalleDto.resenaHistorica?.trim() || null;
    }

    if (updateCalleDto.fechaDenominacion !== undefined) {
      validateHistoricalDate(
        updateCalleDto.fechaDenominacion,
        'La fecha de denominación',
      );

      calle.fechaDenominacion = updateCalleDto.fechaDenominacion ?? null;
    }

    if (updateCalleDto.ubicacion !== undefined) {
      calle.ubicacion = updateCalleDto.ubicacion.trim();
    }

    if (updateCalleDto.sector !== undefined) {
      calle.sector = updateCalleDto.sector?.trim() || null;
    }

    if (updateCalleDto.latitud !== undefined) {
      calle.latitud = updateCalleDto.latitud ?? null;
    }

    if (updateCalleDto.longitud !== undefined) {
      calle.longitud = updateCalleDto.longitud ?? null;
    }

    if (updateCalleDto.fuentesInformacion !== undefined) {
      calle.fuentesInformacion =
        updateCalleDto.fuentesInformacion?.trim() || null;
    }

    if (updateCalleDto.observaciones !== undefined) {
      calle.observaciones = updateCalleDto.observaciones?.trim() || null;
    }

    calle.usuarioModificadorId = String(usuarioId);

    const calleActualizada = await this.callesRepository.save(calle);

    return new ApiResponseDto(
      'Calle actualizada correctamente.',
      CalleResponseDto.fromEntity(calleActualizada),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoCalleDto: UpdateEstadoCalleDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    const calle = await this.findEntityById(id);

    calle.estado = updateEstadoCalleDto.estado;

    calle.usuarioModificadorId = String(usuarioId);

    const calleActualizada = await this.callesRepository.save(calle);

    return new ApiResponseDto(
      'Estado de la calle actualizado correctamente.',
      CalleResponseDto.fromEntity(calleActualizada),
    );
  }

  async delete(id: number, usuarioId: number): Promise<ApiResponseDto<null>> {
    await this.softDeleteEntity(id, String(usuarioId));

    return new ApiResponseDto('Calle eliminada correctamente.', null);
  }

  async restore(
    id: number,
    usuarioId: number,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    const calleRestaurada = await this.restoreEntity(id, String(usuarioId));

    return new ApiResponseDto(
      'Calle restaurada correctamente.',
      CalleResponseDto.fromEntity(calleRestaurada),
    );
  }
}
