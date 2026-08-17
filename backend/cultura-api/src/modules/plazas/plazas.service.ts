import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';
import { validateHistoricalDate } from '../../common/utils/date-validation.util';
import { CreatePlazaDto } from './dto/request/create-plaza.dto';
import { UpdateEstadoPlazaDto } from './dto/request/update-estado-plaza.dto';
import { UpdatePlazaDto } from './dto/request/update-plaza.dto';
import { PlazaResponseDto } from './dto/response/plaza-response.dto';
import { Plaza } from './entities/plaza.entity';

@Injectable()
export class PlazasService extends BasePatrimonialService<Plaza> {
  constructor(
    @InjectRepository(Plaza)
    private readonly plazasRepository: Repository<Plaza>,
  ) {
    super(plazasRepository, 'plaza');
  }

  async findAll(query: PaginationQueryDto): Promise<{
    plazas: PlazaResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.findAllActive(query, (plaza) =>
      PlazaResponseDto.fromEntity(plaza),
    );

    return {
      plazas: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findDeleted(query: PaginationQueryDto): Promise<{
    plazas: PlazaResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.findAllDeleted(query, (plaza) =>
      PlazaResponseDto.fromEntity(plaza),
    );

    return {
      plazas: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findById(id: number): Promise<PlazaResponseDto> {
    const plaza = await this.findEntityById(id);

    return PlazaResponseDto.fromEntity(plaza);
  }

  async create(
    createPlazaDto: CreatePlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    validateHistoricalDate(
      createPlazaDto.fechaCreacion,
      'La fecha de creación',
    );

    const nombreNormalizado = createPlazaDto.nombre.trim();

    await this.validateUniqueName(nombreNormalizado);

    const plaza = this.plazasRepository.create({
      ...createPlazaDto,
      nombre: nombreNormalizado,
      descripcion: createPlazaDto.descripcion.trim(),
      resenaHistorica: createPlazaDto.resenaHistorica?.trim() || null,
      fechaCreacion: createPlazaDto.fechaCreacion ?? null,
      ubicacion: createPlazaDto.ubicacion.trim(),
      latitud: createPlazaDto.latitud ?? null,
      longitud: createPlazaDto.longitud ?? null,
      fuentesInformacion: createPlazaDto.fuentesInformacion?.trim() || null,
      observaciones: createPlazaDto.observaciones?.trim() || null,
      usuarioCreadorId: '1',
    });

    const plazaGuardada = await this.plazasRepository.save(plaza);

    return new ApiResponseDto(
      'Plaza registrada correctamente.',
      PlazaResponseDto.fromEntity(plazaGuardada),
    );
  }

  async update(
    id: number,
    updatePlazaDto: UpdatePlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    const plaza = await this.findEntityById(id);

    if (updatePlazaDto.nombre !== undefined) {
      const nombreNormalizado = updatePlazaDto.nombre.trim();

      await this.validateUniqueName(nombreNormalizado, id);

      plaza.nombre = nombreNormalizado;
    }

    if (updatePlazaDto.descripcion !== undefined) {
      plaza.descripcion = updatePlazaDto.descripcion.trim();
    }

    if (updatePlazaDto.resenaHistorica !== undefined) {
      plaza.resenaHistorica = updatePlazaDto.resenaHistorica?.trim() || null;
    }

    if (updatePlazaDto.fechaCreacion !== undefined) {
      validateHistoricalDate(
        updatePlazaDto.fechaCreacion,
        'La fecha de creación',
      );

      plaza.fechaCreacion = updatePlazaDto.fechaCreacion ?? null;
    }

    if (updatePlazaDto.ubicacion !== undefined) {
      plaza.ubicacion = updatePlazaDto.ubicacion.trim();
    }

    if (updatePlazaDto.latitud !== undefined) {
      plaza.latitud = updatePlazaDto.latitud ?? null;
    }

    if (updatePlazaDto.longitud !== undefined) {
      plaza.longitud = updatePlazaDto.longitud ?? null;
    }

    if (updatePlazaDto.fuentesInformacion !== undefined) {
      plaza.fuentesInformacion =
        updatePlazaDto.fuentesInformacion?.trim() || null;
    }

    if (updatePlazaDto.observaciones !== undefined) {
      plaza.observaciones = updatePlazaDto.observaciones?.trim() || null;
    }

    plaza.usuarioModificadorId = '1';

    const plazaActualizada = await this.plazasRepository.save(plaza);

    return new ApiResponseDto(
      'Plaza actualizada correctamente.',
      PlazaResponseDto.fromEntity(plazaActualizada),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoPlazaDto: UpdateEstadoPlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    const plaza = await this.findEntityById(id);

    plaza.estado = updateEstadoPlazaDto.estado;
    plaza.usuarioModificadorId = '1';

    const plazaActualizada = await this.plazasRepository.save(plaza);

    return new ApiResponseDto(
      'Estado de la plaza actualizado correctamente.',
      PlazaResponseDto.fromEntity(plazaActualizada),
    );
  }

  async delete(id: number): Promise<ApiResponseDto<null>> {
    await this.softDeleteEntity(id, '1');

    return new ApiResponseDto('Plaza eliminada correctamente.', null);
  }

  async restore(id: number): Promise<ApiResponseDto<PlazaResponseDto>> {
    const plazaRestaurada = await this.restoreEntity(id, '1');

    return new ApiResponseDto(
      'Plaza restaurada correctamente.',
      PlazaResponseDto.fromEntity(plazaRestaurada),
    );
  }
}
