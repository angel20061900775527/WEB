import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';
import { CreateMuseoDto } from './dto/request/create-museo.dto';
import { UpdateEstadoMuseoDto } from './dto/request/update-estado-museo.dto';
import { UpdateMuseoDto } from './dto/request/update-museo.dto';
import { MuseoResponseDto } from './dto/response/museo-response.dto';
import { Museo } from './entities/museo.entity';

@Injectable()
export class MuseosService extends BasePatrimonialService<Museo> {
  constructor(
    @InjectRepository(Museo)
    private readonly museosRepository: Repository<Museo>,
  ) {
    super(museosRepository, 'museo');
  }

  async findAll(query: PaginationQueryDto) {
    const result = await this.findAllActive(query, (museo) =>
      MuseoResponseDto.fromEntity(museo),
    );

    return {
      museos: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findDeleted(query: PaginationQueryDto) {
    const result = await this.findAllDeleted(query, (museo) =>
      MuseoResponseDto.fromEntity(museo),
    );

    return {
      museos: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findById(id: number): Promise<MuseoResponseDto> {
    const museo = await this.findEntityById(id);

    return MuseoResponseDto.fromEntity(museo);
  }

  async create(
    createMuseoDto: CreateMuseoDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    const nombreNormalizado = createMuseoDto.nombre.trim();

    await this.validateUniqueName(nombreNormalizado);

    const museo = this.museosRepository.create({
      ...createMuseoDto,

      nombre: nombreNormalizado,

      descripcion: createMuseoDto.descripcion.trim(),

      resenaHistorica: createMuseoDto.resenaHistorica?.trim() || null,

      ubicacion: createMuseoDto.ubicacion.trim(),

      horarioAtencion: createMuseoDto.horarioAtencion?.trim() || null,

      responsable: createMuseoDto.responsable?.trim() || null,

      sitioWeb: createMuseoDto.sitioWeb?.trim() || null,

      latitud: createMuseoDto.latitud ?? null,

      longitud: createMuseoDto.longitud ?? null,

      fuentesInformacion: createMuseoDto.fuentesInformacion?.trim() || null,

      observaciones: createMuseoDto.observaciones?.trim() || null,

      usuarioCreadorId: String(usuarioId),
    });

    const museoGuardado = await this.museosRepository.save(museo);

    return new ApiResponseDto(
      'Museo registrado correctamente.',
      MuseoResponseDto.fromEntity(museoGuardado),
    );
  }

  async update(
    id: number,
    updateMuseoDto: UpdateMuseoDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    const museo = await this.findEntityById(id);

    if (updateMuseoDto.nombre !== undefined) {
      const nombreNormalizado = updateMuseoDto.nombre.trim();

      await this.validateUniqueName(nombreNormalizado, id);

      museo.nombre = nombreNormalizado;
    }

    if (updateMuseoDto.descripcion !== undefined) {
      museo.descripcion = updateMuseoDto.descripcion.trim();
    }

    if (updateMuseoDto.resenaHistorica !== undefined) {
      museo.resenaHistorica = updateMuseoDto.resenaHistorica?.trim() || null;
    }

    if (updateMuseoDto.ubicacion !== undefined) {
      museo.ubicacion = updateMuseoDto.ubicacion.trim();
    }

    if (updateMuseoDto.horarioAtencion !== undefined) {
      museo.horarioAtencion = updateMuseoDto.horarioAtencion?.trim() || null;
    }

    if (updateMuseoDto.responsable !== undefined) {
      museo.responsable = updateMuseoDto.responsable?.trim() || null;
    }

    if (updateMuseoDto.sitioWeb !== undefined) {
      museo.sitioWeb = updateMuseoDto.sitioWeb?.trim() || null;
    }

    if (updateMuseoDto.latitud !== undefined) {
      museo.latitud = updateMuseoDto.latitud ?? null;
    }

    if (updateMuseoDto.longitud !== undefined) {
      museo.longitud = updateMuseoDto.longitud ?? null;
    }

    if (updateMuseoDto.fuentesInformacion !== undefined) {
      museo.fuentesInformacion =
        updateMuseoDto.fuentesInformacion?.trim() || null;
    }

    if (updateMuseoDto.observaciones !== undefined) {
      museo.observaciones = updateMuseoDto.observaciones?.trim() || null;
    }

    museo.usuarioModificadorId = String(usuarioId);

    const museoActualizado = await this.museosRepository.save(museo);

    return new ApiResponseDto(
      'Museo actualizado correctamente.',
      MuseoResponseDto.fromEntity(museoActualizado),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoMuseoDto: UpdateEstadoMuseoDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    const museo = await this.findEntityById(id);

    museo.estado = updateEstadoMuseoDto.estado;

    museo.usuarioModificadorId = String(usuarioId);

    const museoActualizado = await this.museosRepository.save(museo);

    return new ApiResponseDto(
      'Estado del museo actualizado correctamente.',
      MuseoResponseDto.fromEntity(museoActualizado),
    );
  }

  async delete(id: number, usuarioId: number): Promise<ApiResponseDto<null>> {
    await this.softDeleteEntity(id, String(usuarioId));

    return new ApiResponseDto('Museo eliminado correctamente.', null);
  }

  async restore(
    id: number,
    usuarioId: number,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    const museoRestaurado = await this.restoreEntity(id, String(usuarioId));

    return new ApiResponseDto(
      'Museo restaurado correctamente.',
      MuseoResponseDto.fromEntity(museoRestaurado),
    );
  }
}
