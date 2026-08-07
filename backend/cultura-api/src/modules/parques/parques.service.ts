import {ConflictException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';
import { CreateParqueDto } from './dto/request/create-parque.dto';
import { UpdateEstadoParqueDto } from './dto/request/update-estado-parque.dto';
import { UpdateParqueDto } from './dto/request/update-parque.dto';
import { ParqueResponseDto } from './dto/response/parque-response.dto';
import { Parque } from './entities/parque.entity';
import { validateHistoricalDate } from '../../common/utils/date-validation.util';

@Injectable()
export class ParquesService extends BasePatrimonialService<Parque> {
  constructor(
    @InjectRepository(Parque)
    private readonly parquesRepository: Repository<Parque>,
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

  async findById(id: number): Promise<ParqueResponseDto> {
    const parque = await this.findEntityById(id);

    return ParqueResponseDto.fromEntity(parque);
  }

  async create(
    createParqueDto: CreateParqueDto,
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
      usuarioCreadorId: '1',
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

    parque.usuarioModificadorId = '1';

    const parqueActualizado = await this.parquesRepository.save(parque);

    return new ApiResponseDto(
      'Parque actualizado correctamente.',
      ParqueResponseDto.fromEntity(parqueActualizado),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoParqueDto: UpdateEstadoParqueDto,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    const parque = await this.findEntityById(id);

    parque.estado = updateEstadoParqueDto.estado;
    parque.usuarioModificadorId = '1';

    const parqueActualizado = await this.parquesRepository.save(parque);

    return new ApiResponseDto(
      'Estado del parque actualizado correctamente.',
      ParqueResponseDto.fromEntity(parqueActualizado),
    );
  }

  async delete(id: number): Promise<ApiResponseDto<null>> {
    await this.softDeleteEntity(id, '1');

    return new ApiResponseDto('Parque eliminado correctamente.', null);
  }

  async restore(id: number): Promise<ApiResponseDto<ParqueResponseDto>> {
    const parqueRestaurado = await this.restoreEntity(id, '1');

    return new ApiResponseDto(
      'Parque restaurado correctamente.',
      ParqueResponseDto.fromEntity(parqueRestaurado),
    );
  }
}
