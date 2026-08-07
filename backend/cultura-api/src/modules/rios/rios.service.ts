import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { EstadoRegistro } from '../../common/enums/estado-registro.enum';
import { CreateRioDto } from './dto/request/create-rio.dto';
import { UpdateEstadoRioDto } from './dto/request/update-estado-rio.dto';
import { UpdateRioDto } from './dto/request/update-rio.dto';
import { RioResponseDto } from './dto/response/rio-response.dto';
import { BasePatrimonialService } from '../../common/services/base-patrimonial.service';
import { Rio } from './entities/rio.entity';

@Injectable()
export class RiosService extends BasePatrimonialService<Rio> {
  constructor(
    @InjectRepository(Rio)
    private readonly riosRepository: Repository<Rio>,
  ) {
    super(riosRepository, 'río');
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page;
    const limit = query.limit;

    const where: FindOptionsWhere<Rio> = {
      estadoRegistro: EstadoRegistro.ACTIVO,
    };

    if (query.search) {
      where.nombre = ILike(`%${query.search.trim()}%`);
    }

    const [rios, total] = await this.riosRepository.findAndCount({
      where,
      order: {
        nombre: query.order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      rios: rios.map((rio) => RioResponseDto.fromEntity(rio)),
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }

  async findById(id: number): Promise<RioResponseDto> {
    const rio = await this.findEntityById(id);

    return RioResponseDto.fromEntity(rio);
  }

  async create(
    createRioDto: CreateRioDto,
  ): Promise<ApiResponseDto<RioResponseDto>> {
    const nombreNormalizado = createRioDto.nombre.trim();

    await this.validateUniqueName(nombreNormalizado);

    const rio = this.riosRepository.create({
      ...createRioDto,
      nombre: nombreNormalizado,
      descripcion: createRioDto.descripcion.trim(),
      resenaHistorica: createRioDto.resenaHistorica?.trim() || null,
      ubicacion: createRioDto.ubicacion.trim(),
      longitudKm: createRioDto.longitudKm ?? null,
      cuencaHidrografica: createRioDto.cuencaHidrografica?.trim() || null,
      afluenteDe: createRioDto.afluenteDe?.trim() || null,
      latitud: createRioDto.latitud ?? null,
      longitud: createRioDto.longitud ?? null,
      fuentesInformacion: createRioDto.fuentesInformacion?.trim() || null,
      observaciones: createRioDto.observaciones?.trim() || null,
      usuarioCreadorId: '1',
    });

    const rioGuardado = await this.riosRepository.save(rio);

    return new ApiResponseDto(
      'Río registrado correctamente.',
      RioResponseDto.fromEntity(rioGuardado),
    );
  }

  async update(
    id: number,
    updateRioDto: UpdateRioDto,
  ): Promise<ApiResponseDto<RioResponseDto>> {
    const rio = await this.findEntityById(id);

    if (updateRioDto.nombre !== undefined) {
      const nombreNormalizado = updateRioDto.nombre.trim();

      await this.validateUniqueName(nombreNormalizado, id);

      rio.nombre = nombreNormalizado;
    }

    if (updateRioDto.descripcion !== undefined) {
      rio.descripcion = updateRioDto.descripcion.trim();
    }

    if (updateRioDto.resenaHistorica !== undefined) {
      rio.resenaHistorica = updateRioDto.resenaHistorica?.trim() || null;
    }

    if (updateRioDto.ubicacion !== undefined) {
      rio.ubicacion = updateRioDto.ubicacion.trim();
    }

    if (updateRioDto.longitudKm !== undefined) {
      rio.longitudKm = updateRioDto.longitudKm ?? null;
    }

    if (updateRioDto.cuencaHidrografica !== undefined) {
      rio.cuencaHidrografica = updateRioDto.cuencaHidrografica?.trim() || null;
    }

    if (updateRioDto.afluenteDe !== undefined) {
      rio.afluenteDe = updateRioDto.afluenteDe?.trim() || null;
    }

    if (updateRioDto.estadoConservacion !== undefined) {
      rio.estadoConservacion = updateRioDto.estadoConservacion;
    }

    if (updateRioDto.tipo !== undefined) {
      rio.tipo = updateRioDto.tipo;
    }

    if (updateRioDto.aptoBalneario !== undefined) {
      rio.aptoBalneario = updateRioDto.aptoBalneario;
    }

    if (updateRioDto.latitud !== undefined) {
      rio.latitud = updateRioDto.latitud ?? null;
    }

    if (updateRioDto.longitud !== undefined) {
      rio.longitud = updateRioDto.longitud ?? null;
    }

    if (updateRioDto.fuentesInformacion !== undefined) {
      rio.fuentesInformacion = updateRioDto.fuentesInformacion?.trim() || null;
    }

    if (updateRioDto.observaciones !== undefined) {
      rio.observaciones = updateRioDto.observaciones?.trim() || null;
    }

    rio.usuarioModificadorId = '1';

    const rioActualizado = await this.riosRepository.save(rio);

    return new ApiResponseDto(
      'Río actualizado correctamente.',
      RioResponseDto.fromEntity(rioActualizado),
    );
  }

  async updateEstado(
    id: number,
    updateEstadoRioDto: UpdateEstadoRioDto,
  ): Promise<ApiResponseDto<RioResponseDto>> {
    const rio = await this.findEntityById(id);

    rio.estado = updateEstadoRioDto.estado;
    rio.usuarioModificadorId = '1';

    const rioActualizado = await this.riosRepository.save(rio);

    return new ApiResponseDto(
      'Estado del río actualizado correctamente.',
      RioResponseDto.fromEntity(rioActualizado),
    );
  }

  async delete(id: number): Promise<ApiResponseDto<null>> {
    const rio = await this.findEntityById(id);

    rio.estadoRegistro = EstadoRegistro.ELIMINADO;
    rio.fechaEliminacion = new Date();
    rio.usuarioEliminadorId = '1';

    await this.riosRepository.save(rio);

    return new ApiResponseDto('Río eliminado correctamente.', null);
  }

  async restore(id: number): Promise<ApiResponseDto<RioResponseDto>> {
    const rio = await this.findDeletedEntityById(id);

    await this.validateUniqueName(rio.nombre);

    rio.estadoRegistro = EstadoRegistro.ACTIVO;
    rio.fechaEliminacion = null;
    rio.usuarioEliminadorId = null;
    rio.usuarioModificadorId = '1';

    const rioRestaurado = await this.riosRepository.save(rio);

    return new ApiResponseDto(
      'Río restaurado correctamente.',
      RioResponseDto.fromEntity(rioRestaurado),
    );
  }
}
