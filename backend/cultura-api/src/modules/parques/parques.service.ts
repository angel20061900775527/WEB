import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { CreateParqueDto } from './dto/request/create-parque.dto';
import { UpdateParqueDto } from './dto/request/update-parque.dto';
import { ParqueResponseDto } from './dto/response/parque-response.dto';
import { Parque } from './entities/parque.entity';
import { UpdateEstadoParqueDto } from './dto/request/update-estado-parque.dto';
import { EstadoRegistro } from '../../common/enums/estado-registro.enum';

@Injectable()
export class ParquesService {
  constructor(
    @InjectRepository(Parque)
    private readonly parquesRepository: Repository<Parque>,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const page = query.page;
    const limit = query.limit;

    const where: FindOptionsWhere<Parque> = {
      estadoRegistro: EstadoRegistro.ACTIVO,
    };

    if (query.search) {
      where.nombre = ILike(`%${query.search.trim()}%`);
    }

    const [parques, total] = await this.parquesRepository.findAndCount({
      where,
      order: {
        nombre: query.order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      parques: parques.map((parque) => ParqueResponseDto.fromEntity(parque)),
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }

  async findById(id: number): Promise<ParqueResponseDto> {
    const parque = await this.findEntityById(id);

    return ParqueResponseDto.fromEntity(parque);
  }

  async create(
    createParqueDto: CreateParqueDto,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    this.validateFechaCreacion(createParqueDto.fechaCreacion);

    const nombreNormalizado = createParqueDto.nombre.trim();

    await this.validateNombreUnico(nombreNormalizado);

    const parque = this.parquesRepository.create({
      ...createParqueDto,
      nombre: nombreNormalizado,
      descripcion: createParqueDto.descripcion.trim(),
      resenaHistorica: createParqueDto.resenaHistorica?.trim() || null,
      fechaCreacion: createParqueDto.fechaCreacion ?? null,
      ubicacion: createParqueDto.ubicacion.trim(),
      latitud: createParqueDto.latitud ?? null,
      longitud: createParqueDto.longitud ?? null,
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

      await this.validateNombreUnico(nombreNormalizado, id);

      parque.nombre = nombreNormalizado;
    }

    if (updateParqueDto.descripcion !== undefined) {
      parque.descripcion = updateParqueDto.descripcion.trim();
    }

    if (updateParqueDto.resenaHistorica !== undefined) {
      parque.resenaHistorica = updateParqueDto.resenaHistorica?.trim() || null;
    }

    if (updateParqueDto.fechaCreacion !== undefined) {
      this.validateFechaCreacion(updateParqueDto.fechaCreacion);

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
    const parque = await this.findEntityById(id);

    parque.estadoRegistro = EstadoRegistro.ELIMINADO;
    parque.fechaEliminacion = new Date();
    parque.usuarioEliminadorId = '1';

    await this.parquesRepository.save(parque);

    return new ApiResponseDto('Parque eliminado correctamente.', null);
  }
  private async findEntityById(id: number): Promise<Parque> {
    const parque = await this.parquesRepository.findOne({
      where: {
        id,
        estadoRegistro: EstadoRegistro.ACTIVO,
      },
    });

    if (!parque) {
      throw new NotFoundException(
        `No se encontró un parque activo con el identificador ${id}.`,
      );
    }

    return parque;
  }

  private async validateNombreUnico(
    nombre: string,
    parqueIdExcluir?: number,
  ): Promise<void> {
    const where: FindOptionsWhere<Parque> = {
      nombre: ILike(nombre),
      estadoRegistro: EstadoRegistro.ACTIVO,
    };

    if (parqueIdExcluir !== undefined) {
      where.id = Not(parqueIdExcluir);
    }

    const parqueExistente = await this.parquesRepository.findOne({
      where,
    });

    if (parqueExistente) {
      throw new ConflictException(
        'Ya existe un parque activo registrado con ese nombre.',
      );
    }
  }

  private validateFechaCreacion(fechaCreacion?: string): void {
    if (!fechaCreacion) {
      return;
    }

    const fecha = new Date(`${fechaCreacion}T00:00:00.000Z`);

    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException('La fecha de creación no es válida.');
    }

    const hoy = new Date();
    hoy.setUTCHours(23, 59, 59, 999);

    if (fecha > hoy) {
      throw new BadRequestException(
        'La fecha de creación no puede ser posterior a la fecha actual.',
      );
    }
  }
}
