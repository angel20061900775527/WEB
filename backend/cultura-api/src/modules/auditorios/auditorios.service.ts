import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';
import { CreateAuditorioDto } from './dto/request/create-auditorio.dto';
import { UpdateEstadoAuditorioDto } from './dto/request/update-estado-auditorio.dto';
import { UpdateAuditorioDto } from './dto/request/update-auditorio.dto';
import { AuditorioResponseDto } from './dto/response/auditorio-response.dto';
import { Auditorio } from './entities/auditorio.entity';

@Injectable()
export class AuditoriosService extends BasePatrimonialService<Auditorio> {
  constructor(
    @InjectRepository(Auditorio)
    private readonly auditoriosRepository: Repository<Auditorio>,
  ) {
    super(auditoriosRepository, 'auditorio');
  }

  async findAll(query: PaginationQueryDto) {
    const result = await this.findAllActive(query, (auditorio) =>
      AuditorioResponseDto.fromEntity(auditorio),
    );

    return {
      auditorios: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
  async findDeleted(query: PaginationQueryDto) {
    const result = await this.findAllDeleted(query, (auditorio) =>
      AuditorioResponseDto.fromEntity(auditorio),
    );

    return {
      auditorios: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findById(id: number): Promise<AuditorioResponseDto> {
    const auditorio = await this.findEntityById(id);

    return AuditorioResponseDto.fromEntity(auditorio);
  }

  async create(
    createauditorioDto: CreateAuditorioDto,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    const nombreNormalizado = createauditorioDto.nombre.trim();

    await this.validateUniqueName(nombreNormalizado);

    const auditorio = this.auditoriosRepository.create({
      ...createauditorioDto,
      nombre: nombreNormalizado,
      descripcion: createauditorioDto.descripcion.trim(),
      resenaHistorica: createauditorioDto.resenaHistorica?.trim() || null,
      ubicacion: createauditorioDto.ubicacion.trim(),
      horarioAtencion: createauditorioDto.horarioAtencion?.trim() || null,
      responsable: createauditorioDto.responsable?.trim() || null,
      sitioWeb: createauditorioDto.sitioWeb?.trim() || null,
      latitud: createauditorioDto.latitud ?? null,
      longitud: createauditorioDto.longitud ?? null,
      fuentesInformacion: createauditorioDto.fuentesInformacion?.trim() || null,
      observaciones: createauditorioDto.observaciones?.trim() || null,
      usuarioCreadorId: '1',
    });

    const auditorioGuardado = await this.auditoriosRepository.save(auditorio);

    return new ApiResponseDto(
      'auditorio registrado correctamente.',
      AuditorioResponseDto.fromEntity(auditorioGuardado),
    );
  }

  async update(
    id: number,
    updateAuditorioDto: UpdateAuditorioDto,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    const auditorio = await this.findEntityById(id);

    if (updateAuditorioDto.nombre !== undefined) {
      const nombreNormalizado = updateAuditorioDto.nombre.trim();

      await this.validateUniqueName(nombreNormalizado, id);

      auditorio.nombre = nombreNormalizado;
    }

    if (updateAuditorioDto.descripcion !== undefined) {
      auditorio.descripcion = updateAuditorioDto.descripcion.trim();
    }

    if (updateAuditorioDto.resenaHistorica !== undefined) {
      auditorio.resenaHistorica =
        updateAuditorioDto.resenaHistorica?.trim() || null;
    }

    if (updateAuditorioDto.ubicacion !== undefined) {
      auditorio.ubicacion = updateAuditorioDto.ubicacion.trim();
    }

    if (updateAuditorioDto.horarioAtencion !== undefined) {
      auditorio.horarioAtencion =
        updateAuditorioDto.horarioAtencion?.trim() || null;
    }

    if (updateAuditorioDto.responsable !== undefined) {
      auditorio.responsable = updateAuditorioDto.responsable?.trim() || null;
    }

    if (updateAuditorioDto.sitioWeb !== undefined) {
      auditorio.sitioWeb = updateAuditorioDto.sitioWeb?.trim() || null;
    }

    if (updateAuditorioDto.latitud !== undefined) {
      auditorio.latitud = updateAuditorioDto.latitud ?? null;
    }

    if (updateAuditorioDto.longitud !== undefined) {
      auditorio.longitud = updateAuditorioDto.longitud ?? null;
    }

    if (updateAuditorioDto.fuentesInformacion !== undefined) {
      auditorio.fuentesInformacion =
        updateAuditorioDto.fuentesInformacion?.trim() || null;
    }

    if (updateAuditorioDto.observaciones !== undefined) {
      auditorio.observaciones =
        updateAuditorioDto.observaciones?.trim() || null;
    }

    auditorio.usuarioModificadorId = '1';

    const auditorioActualizado =
      await this.auditoriosRepository.save(auditorio);

    return new ApiResponseDto(
      'auditorio actualizado correctamente.',
      AuditorioResponseDto.fromEntity(auditorioActualizado),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoauditorioDto: UpdateEstadoAuditorioDto,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    const auditorio = await this.findEntityById(id);

    auditorio.estado = updateEstadoauditorioDto.estado;
    auditorio.usuarioModificadorId = '1';

    const auditorioActualizado =
      await this.auditoriosRepository.save(auditorio);

    return new ApiResponseDto(
      'Estado del auditorio actualizado correctamente.',
      AuditorioResponseDto.fromEntity(auditorioActualizado),
    );
  }

  async delete(id: number): Promise<ApiResponseDto<null>> {
    await this.softDeleteEntity(id, '1');

    return new ApiResponseDto('auditorio eliminado correctamente.', null);
  }

  async restore(id: number): Promise<ApiResponseDto<AuditorioResponseDto>> {
    const auditorioRestaurado = await this.restoreEntity(id, '1');

    return new ApiResponseDto(
      'auditorio restaurado correctamente.',
      AuditorioResponseDto.fromEntity(auditorioRestaurado),
    );
  }
}
