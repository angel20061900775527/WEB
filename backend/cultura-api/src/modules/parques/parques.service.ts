import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { CreateParqueDto } from './dto/request/create-parque.dto';
import { ParqueResponseDto } from './dto/response/parque-response.dto';
import { Parque } from './entities/parque.entity';

@Injectable()
export class ParquesService {
  constructor(
    @InjectRepository(Parque)
    private readonly parquesRepository: Repository<Parque>,
  ) {}

  async findAll(query: PaginationQueryDto) {
    const page = query.page;
    const limit = query.limit;

    const where: FindOptionsWhere<Parque> = {};

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

  async create(
    createParqueDto: CreateParqueDto,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    this.validateFechaCreacion(createParqueDto.fechaCreacion);

    const nombreNormalizado = createParqueDto.nombre.trim();

    const parqueExistente = await this.parquesRepository.findOne({
      where: {
        nombre: ILike(nombreNormalizado),
      },
    });

    if (parqueExistente) {
      throw new ConflictException(
        'Ya existe un parque registrado con ese nombre.',
      );
    }

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
