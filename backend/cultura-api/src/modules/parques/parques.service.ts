import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoParque } from './enums/estado-parque.enum';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';
import { validateHistoricalDate } from '../../common/utils/date-validation.util';
import { CreateParqueDto } from './dto/request/create-parque.dto';
import { UpdateEstadoParqueDto } from './dto/request/update-estado-parque.dto';
import { UpdateParqueDto } from './dto/request/update-parque.dto';
import { ParqueResponseDto } from './dto/response/parque-response.dto';
import { Parque } from './entities/parque.entity';
import { FotografiasService } from '../fotografias/fotografias.service';
@Injectable()
export class ParquesService extends BasePatrimonialService<Parque> {
  constructor(
    @InjectRepository(Parque)
    private readonly parquesRepository: Repository<Parque>,

    private readonly fotografiasService: FotografiasService,
  ) {
    super(parquesRepository, 'parque');
  }

  async findAll(query: PaginationQueryDto) {
    const result = await this.findAllActive(query, (parque) =>
      ParqueResponseDto.fromEntity(parque),
    );

    return {
      parques: result.items,
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

    const result = await this.findAllActive(publicQuery, (parque) =>
      ParqueResponseDto.fromEntity(parque),
    );

    const urlsFotografias = await this.fotografiasService.obtenerUrlsPorIds(
      result.items.map((parque) => parque.fotografiaPrincipalId),
    );

    const parques = result.items.map((parque) => ({
      ...parque,

      fotografiaPrincipalUrl: parque.fotografiaPrincipalId
        ? (urlsFotografias[String(parque.fotografiaPrincipalId)] ?? null)
        : null,
    }));

    return {
      parques,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
  async findOnePublic(id: number): Promise<ParqueResponseDto> {
    const parque = await this.findEntityById(id);

    if (parque.estado !== EstadoParque.PUBLICADO) {
      throw new NotFoundException('Parque no encontrado.');
    }

    return ParqueResponseDto.fromEntity(parque);
  }
  async findDeleted(query: PaginationQueryDto) {
    const result = await this.findAllDeleted(query, (parque) =>
      ParqueResponseDto.fromEntity(parque),
    );

    return {
      parques: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findById(id: number): Promise<ParqueResponseDto> {
    const parque = await this.findEntityById(id);

    return ParqueResponseDto.fromEntity(parque);
  }

  async create(
    createParqueDto: CreateParqueDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    validateHistoricalDate(
      createParqueDto.fechaCreacion,
      'La fecha de creación',
    );

    const nombreNormalizado = createParqueDto.nombre.trim();

    await this.validateUniqueName(nombreNormalizado);

    const parque = this.parquesRepository.create({
      ...createParqueDto,

      nombre: nombreNormalizado,

      descripcion: createParqueDto.descripcion.trim(),

      resenaHistorica: createParqueDto.resenaHistorica?.trim() || null,

      fechaCreacion: createParqueDto.fechaCreacion ?? null,

      ubicacion: createParqueDto.ubicacion.trim(),

      latitud: createParqueDto.latitud ?? null,

      longitud: createParqueDto.longitud ?? null,

      fuentesInformacion: createParqueDto.fuentesInformacion?.trim() || null,

      observaciones: createParqueDto.observaciones?.trim() || null,

      usuarioCreadorId: String(usuarioId),
    });

    const parqueGuardado = await this.parquesRepository.save(parque);

    return new ApiResponseDto(
      'Parque registrado correctamente.',
      ParqueResponseDto.fromEntity(parqueGuardado),
    );
  }

  async update(
    id: number,
    updateParqueDto: UpdateParqueDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    const parque = await this.findEntityById(id);

    if (updateParqueDto.nombre !== undefined) {
      const nombreNormalizado = updateParqueDto.nombre.trim();

      await this.validateUniqueName(nombreNormalizado, id);

      parque.nombre = nombreNormalizado;
    }

    if (updateParqueDto.descripcion !== undefined) {
      parque.descripcion = updateParqueDto.descripcion.trim();
    }

    if (updateParqueDto.resenaHistorica !== undefined) {
      parque.resenaHistorica = updateParqueDto.resenaHistorica?.trim() || null;
    }

    if (updateParqueDto.fechaCreacion !== undefined) {
      validateHistoricalDate(
        updateParqueDto.fechaCreacion,
        'La fecha de creación',
      );

      parque.fechaCreacion = updateParqueDto.fechaCreacion ?? null;
    }

    if (updateParqueDto.ubicacion !== undefined) {
      parque.ubicacion = updateParqueDto.ubicacion.trim();
    }

    if (updateParqueDto.latitud !== undefined) {
      parque.latitud = updateParqueDto.latitud ?? null;
    }

    if (updateParqueDto.longitud !== undefined) {
      parque.longitud = updateParqueDto.longitud ?? null;
    }

    if (updateParqueDto.fuentesInformacion !== undefined) {
      parque.fuentesInformacion =
        updateParqueDto.fuentesInformacion?.trim() || null;
    }

    if (updateParqueDto.observaciones !== undefined) {
      parque.observaciones = updateParqueDto.observaciones?.trim() || null;
    }

    parque.usuarioModificadorId = String(usuarioId);

    const parqueActualizado = await this.parquesRepository.save(parque);

    return new ApiResponseDto(
      'Parque actualizado correctamente.',
      ParqueResponseDto.fromEntity(parqueActualizado),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoParqueDto: UpdateEstadoParqueDto,
    usuarioId: number,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    const parque = await this.findEntityById(id);

    parque.estado = updateEstadoParqueDto.estado;

    parque.usuarioModificadorId = String(usuarioId);

    const parqueActualizado = await this.parquesRepository.save(parque);

    return new ApiResponseDto(
      'Estado del parque actualizado correctamente.',
      ParqueResponseDto.fromEntity(parqueActualizado),
    );
  }

  async delete(id: number, usuarioId: number): Promise<ApiResponseDto<null>> {
    await this.softDeleteEntity(id, String(usuarioId));

    return new ApiResponseDto('Parque eliminado correctamente.', null);
  }

  async restore(
    id: number,
    usuarioId: number,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    const parqueRestaurado = await this.restoreEntity(id, String(usuarioId));

    return new ApiResponseDto(
      'Parque restaurado correctamente.',
      ParqueResponseDto.fromEntity(parqueRestaurado),
    );
  }
}
