import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';

import { FotografiasService } from '../fotografias/fotografias.service';

import { CreateAuditorioDto } from './dto/request/create-auditorio.dto';
import { UpdateEstadoAuditorioDto } from './dto/request/update-estado-auditorio.dto';
import { UpdateAuditorioDto } from './dto/request/update-auditorio.dto';
import { AuditorioResponseDto } from './dto/response/auditorio-response.dto';
import { Auditorio } from './entities/auditorio.entity';
import { EstadoAuditorio } from './enums/estado-auditorio.enum';

@Injectable()
export class AuditoriosService extends BasePatrimonialService<Auditorio> {
  constructor(
    @InjectRepository(Auditorio)
    private readonly auditoriosRepository: Repository<Auditorio>,

    private readonly fotografiasService: FotografiasService,
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

  async findAllPublic(query: PaginationQueryDto) {
    const publicQuery: PaginationQueryDto = {
      ...query,
      estado: 'PUBLICADO',
    };

    const result = await this.findAllActive(publicQuery, (auditorio) =>
      AuditorioResponseDto.fromEntity(auditorio),
    );

    const urlsFotografias = await this.fotografiasService.obtenerUrlsPorIds(
      result.items.map((auditorio) => auditorio.fotografiaPrincipalId),
    );

    const auditorios = result.items.map((auditorio) => ({
      ...auditorio,

      fotografiaPrincipalUrl: auditorio.fotografiaPrincipalId
        ? (urlsFotografias[String(auditorio.fotografiaPrincipalId)] ?? null)
        : null,
    }));

    return {
      auditorios,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findOnePublic(id: number): Promise<AuditorioResponseDto> {
    const auditorio = await this.findEntityById(id);

    if (auditorio.estado !== EstadoAuditorio.PUBLICADO) {
      throw new NotFoundException('Auditorio no encontrado.');
    }

    return AuditorioResponseDto.fromEntity(auditorio);
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
    createAuditorioDto: CreateAuditorioDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    const nombreNormalizado = createAuditorioDto.nombre.trim();

    await this.validateUniqueName(nombreNormalizado);

    const auditorio = this.auditoriosRepository.create({
      ...createAuditorioDto,

      nombre: nombreNormalizado,

      descripcion: createAuditorioDto.descripcion.trim(),

      resenaHistorica: createAuditorioDto.resenaHistorica?.trim() || null,

      ubicacion: createAuditorioDto.ubicacion.trim(),

      horarioAtencion: createAuditorioDto.horarioAtencion?.trim() || null,

      responsable: createAuditorioDto.responsable?.trim() || null,

      sitioWeb: createAuditorioDto.sitioWeb?.trim() || null,

      latitud: createAuditorioDto.latitud ?? null,

      longitud: createAuditorioDto.longitud ?? null,

      fuentesInformacion: createAuditorioDto.fuentesInformacion?.trim() || null,

      observaciones: createAuditorioDto.observaciones?.trim() || null,

      usuarioCreadorId: String(usuarioId),
    });

    const auditorioGuardado = await this.auditoriosRepository.save(auditorio);

    return new ApiResponseDto(
      'Auditorio registrado correctamente.',
      AuditorioResponseDto.fromEntity(auditorioGuardado),
    );
  }

  async update(
    id: number,
    updateAuditorioDto: UpdateAuditorioDto,
    usuarioId: number,
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

    auditorio.usuarioModificadorId = String(usuarioId);

    const auditorioActualizado =
      await this.auditoriosRepository.save(auditorio);

    return new ApiResponseDto(
      'Auditorio actualizado correctamente.',
      AuditorioResponseDto.fromEntity(auditorioActualizado),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoAuditorioDto: UpdateEstadoAuditorioDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    const auditorio = await this.findEntityById(id);

    auditorio.estado = updateEstadoAuditorioDto.estado;

    auditorio.usuarioModificadorId = String(usuarioId);

    const auditorioActualizado =
      await this.auditoriosRepository.save(auditorio);

    return new ApiResponseDto(
      'Estado del auditorio actualizado correctamente.',
      AuditorioResponseDto.fromEntity(auditorioActualizado),
    );
  }

  async delete(id: number, usuarioId: number): Promise<ApiResponseDto<null>> {
    await this.softDeleteEntity(id, String(usuarioId));

    return new ApiResponseDto('Auditorio eliminado correctamente.', null);
  }

  async restore(
    id: number,
    usuarioId: number,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    const auditorioRestaurado = await this.restoreEntity(id, String(usuarioId));

    return new ApiResponseDto(
      'Auditorio restaurado correctamente.',
      AuditorioResponseDto.fromEntity(auditorioRestaurado),
    );
  }
}
