import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { relative } from 'path';
import { In, IsNull, Repository } from 'typeorm';

import { EstadoRegistro } from '../../common/enums/estado-registro.enum';

import { Auditorio } from '../auditorios/entities/auditorio.entity';
import { Calle } from '../calles/entities/calle.entity';
import { Monumento } from '../monumentos/entities/monumento.entity';
import { Museo } from '../museos/entities/museo.entity';
import { Parque } from '../parques/entities/parque.entity';
import { Plaza } from '../plazas/entities/plaza.entity';
import { Rio } from '../rios/entities/rio.entity';

import { FotografiaResponseDto } from './dto/response/fotografia-response.dto';
import { Fotografia } from './entities/fotografia.entity';
import { TipoPatrimonio } from './enums/tipo-patrimonio.enum';

@Injectable()
export class FotografiasService {
  constructor(
    @InjectRepository(Fotografia)
    private readonly fotografiasRepository: Repository<Fotografia>,

    @InjectRepository(Parque)
    private readonly parquesRepository: Repository<Parque>,

    @InjectRepository(Calle)
    private readonly callesRepository: Repository<Calle>,

    @InjectRepository(Monumento)
    private readonly monumentosRepository: Repository<Monumento>,

    @InjectRepository(Rio)
    private readonly riosRepository: Repository<Rio>,

    @InjectRepository(Plaza)
    private readonly plazasRepository: Repository<Plaza>,

    @InjectRepository(Museo)
    private readonly museosRepository: Repository<Museo>,

    @InjectRepository(Auditorio)
    private readonly auditoriosRepository: Repository<Auditorio>,
  ) {}

  async registrar(
    tipoPatrimonio: TipoPatrimonio,
    registroId: number,
    file: Express.Multer.File,
    usuarioId: number | string,
    descripcion?: string,
  ): Promise<FotografiaResponseDto> {
    await this.validarRegistroPatrimonial(tipoPatrimonio, registroId);

    if (!file) {
      throw new BadRequestException('Debe adjuntar una fotografía.');
    }

    const rutaRelativa = relative(process.cwd(), file.path).replace(/\\/g, '/');

    const fotografia = this.fotografiasRepository.create({
      tipoPatrimonio,
      registroId: String(registroId),
      nombreOriginal: file.originalname,
      nombreArchivo: file.filename,
      mimeType: file.mimetype,
      tamanioBytes: String(file.size),
      ruta: rutaRelativa,
      descripcion: descripcion?.trim() || null,
      usuarioCreadorId: String(usuarioId),
    });

    const fotografiaGuardada =
      await this.fotografiasRepository.save(fotografia);

    return FotografiaResponseDto.fromEntity(fotografiaGuardada);
  }

  async listarPorRegistro(
    tipoPatrimonio: TipoPatrimonio,
    registroId: number,
  ): Promise<FotografiaResponseDto[]> {
    await this.validarRegistroPatrimonial(tipoPatrimonio, registroId);

    const fotografias = await this.fotografiasRepository.find({
      where: {
        tipoPatrimonio,
        registroId: String(registroId),
        estadoRegistro: EstadoRegistro.ACTIVO,
        fechaEliminacion: IsNull(),
      },
      order: {
        fechaRegistro: 'DESC',
      },
    });

    return fotografias.map((fotografia) =>
      FotografiaResponseDto.fromEntity(fotografia),
    );
  }

  async obtenerUrlsPorIds(
    fotografiaIds: Array<string | number | null | undefined>,
  ): Promise<Record<string, string>> {
    const ids = fotografiaIds
      .filter(
        (id): id is string | number =>
          id !== null && id !== undefined && String(id).trim() !== '',
      )
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      return {};
    }

    const fotografias = await this.fotografiasRepository.find({
      where: {
        id: In(ids),
        estadoRegistro: EstadoRegistro.ACTIVO,
        fechaEliminacion: IsNull(),
      },
    });

    return fotografias.reduce<Record<string, string>>(
      (resultado, fotografia) => {
        const dto = FotografiaResponseDto.fromEntity(fotografia);

        resultado[String(fotografia.id)] = dto.url;

        return resultado;
      },
      {},
    );
  }

  async listarPublicasPorRegistro(
    tipoPatrimonio: TipoPatrimonio,
    registroId: number,
  ): Promise<FotografiaResponseDto[]> {
    await this.validarRegistroPatrimonialPublicado(tipoPatrimonio, registroId);

    const fotografias = await this.fotografiasRepository.find({
      where: {
        tipoPatrimonio,
        registroId: String(registroId),
        estadoRegistro: EstadoRegistro.ACTIVO,
        fechaEliminacion: IsNull(),
      },
      order: {
        fechaRegistro: 'DESC',
      },
    });

    return fotografias.map((fotografia) =>
      FotografiaResponseDto.fromEntity(fotografia),
    );
  }
  async obtenerPorId(id: number): Promise<FotografiaResponseDto> {
    const fotografia = await this.findEntityById(id);

    return FotografiaResponseDto.fromEntity(fotografia);
  }

  async establecerPrincipal(
    id: number,
    usuarioId: number | string,
  ): Promise<FotografiaResponseDto> {
    const fotografia = await this.findEntityById(id);

    await this.validarRegistroPatrimonial(
      fotografia.tipoPatrimonio,
      Number(fotografia.registroId),
    );

    await this.asignarFotografiaPrincipal(
      fotografia.tipoPatrimonio,
      Number(fotografia.registroId),
      String(fotografia.id),
      String(usuarioId),
    );

    return FotografiaResponseDto.fromEntity(fotografia);
  }

  async eliminar(id: number, usuarioId: number | string): Promise<void> {
    const fotografia = await this.findEntityById(id);

    const esPrincipal = await this.esFotografiaPrincipal(fotografia);

    if (esPrincipal) {
      throw new ConflictException(
        'No puede eliminar la fotografía principal. Seleccione primero otra fotografía como principal.',
      );
    }

    fotografia.fechaEliminacion = new Date();

    fotografia.usuarioEliminadorId = String(usuarioId);

    await this.fotografiasRepository.save(fotografia);
  }

  private async findEntityById(id: number): Promise<Fotografia> {
    const fotografia = await this.fotografiasRepository.findOne({
      where: {
        id,
        estadoRegistro: EstadoRegistro.ACTIVO,
        fechaEliminacion: IsNull(),
      },
    });

    if (!fotografia) {
      throw new NotFoundException('No se encontró la fotografía indicada.');
    }

    return fotografia;
  }

  private async validarRegistroPatrimonial(
    tipoPatrimonio: TipoPatrimonio,
    registroId: number,
  ): Promise<void> {
    let existe = false;

    switch (tipoPatrimonio) {
      case TipoPatrimonio.PARQUE:
        existe = await this.existeRegistroActivo(
          this.parquesRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.CALLE:
        existe = await this.existeRegistroActivo(
          this.callesRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.MONUMENTO:
        existe = await this.existeRegistroActivo(
          this.monumentosRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.RIO:
        existe = await this.existeRegistroActivo(
          this.riosRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.PLAZA:
        existe = await this.existeRegistroActivo(
          this.plazasRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.MUSEO:
        existe = await this.existeRegistroActivo(
          this.museosRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.AUDITORIO:
        existe = await this.existeRegistroActivo(
          this.auditoriosRepository,
          registroId,
        );
        break;

      default:
        throw new BadRequestException(
          'El tipo de patrimonio indicado no es válido.',
        );
    }

    if (!existe) {
      throw new NotFoundException(
        'No se encontró el registro patrimonial indicado.',
      );
    }
  }

  private async validarRegistroPatrimonialPublicado(
    tipoPatrimonio: TipoPatrimonio,
    registroId: number,
  ): Promise<void> {
    let existe = false;

    switch (tipoPatrimonio) {
      case TipoPatrimonio.PARQUE:
        existe = await this.existeRegistroPublicado(
          this.parquesRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.CALLE:
        existe = await this.existeRegistroPublicado(
          this.callesRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.MONUMENTO:
        existe = await this.existeRegistroPublicado(
          this.monumentosRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.RIO:
        existe = await this.existeRegistroPublicado(
          this.riosRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.PLAZA:
        existe = await this.existeRegistroPublicado(
          this.plazasRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.MUSEO:
        existe = await this.existeRegistroPublicado(
          this.museosRepository,
          registroId,
        );
        break;

      case TipoPatrimonio.AUDITORIO:
        existe = await this.existeRegistroPublicado(
          this.auditoriosRepository,
          registroId,
        );
        break;

      default:
        throw new BadRequestException(
          'El tipo de patrimonio indicado no es válido.',
        );
    }

    if (!existe) {
      throw new NotFoundException(
        'No se encontró el registro patrimonial indicado.',
      );
    }
  }
  private async existeRegistroActivo<T extends object>(
    repository: Repository<T>,
    registroId: number,
  ): Promise<boolean> {
    return repository
      .createQueryBuilder('registro')
      .where('registro.id = :registroId', {
        registroId,
      })
      .andWhere('registro.estadoRegistro = :estadoRegistro', {
        estadoRegistro: EstadoRegistro.ACTIVO,
      })
      .getExists();
  }
  private async existeRegistroPublicado<T extends object>(
    repository: Repository<T>,
    registroId: number,
  ): Promise<boolean> {
    return repository
      .createQueryBuilder('registro')
      .where('registro.id = :registroId', {
        registroId,
      })
      .andWhere('registro.estadoRegistro = :estadoRegistro', {
        estadoRegistro: EstadoRegistro.ACTIVO,
      })
      .andWhere('registro.estado = :estado', {
        estado: 'PUBLICADO',
      })
      .getExists();
  }

  private async asignarFotografiaPrincipal(
    tipoPatrimonio: TipoPatrimonio,
    registroId: number,
    fotografiaId: string,
    usuarioId: string,
  ): Promise<void> {
    const datos = {
      fotografiaPrincipalId: fotografiaId,
      usuarioModificadorId: usuarioId,
    };

    switch (tipoPatrimonio) {
      case TipoPatrimonio.PARQUE:
        await this.parquesRepository.update(registroId, datos);
        break;

      case TipoPatrimonio.CALLE:
        await this.callesRepository.update(registroId, datos);
        break;

      case TipoPatrimonio.MONUMENTO:
        await this.monumentosRepository.update(registroId, datos);
        break;

      case TipoPatrimonio.RIO:
        await this.riosRepository.update(registroId, datos);
        break;

      case TipoPatrimonio.PLAZA:
        await this.plazasRepository.update(registroId, datos);
        break;

      case TipoPatrimonio.MUSEO:
        await this.museosRepository.update(registroId, datos);
        break;

      case TipoPatrimonio.AUDITORIO:
        await this.auditoriosRepository.update(registroId, datos);
        break;
    }
  }

  private async esFotografiaPrincipal(
    fotografia: Fotografia,
  ): Promise<boolean> {
    const registroId = Number(fotografia.registroId);

    const fotografiaId = String(fotografia.id);

    switch (fotografia.tipoPatrimonio) {
      case TipoPatrimonio.PARQUE: {
        const registro = await this.parquesRepository.findOne({
          where: {
            id: registroId,
          },
        });

        return String(registro?.fotografiaPrincipalId ?? '') === fotografiaId;
      }

      case TipoPatrimonio.CALLE: {
        const registro = await this.callesRepository.findOne({
          where: {
            id: registroId,
          },
        });

        return String(registro?.fotografiaPrincipalId ?? '') === fotografiaId;
      }

      case TipoPatrimonio.MONUMENTO: {
        const registro = await this.monumentosRepository.findOne({
          where: {
            id: registroId,
          },
        });

        return String(registro?.fotografiaPrincipalId ?? '') === fotografiaId;
      }

      case TipoPatrimonio.RIO: {
        const registro = await this.riosRepository.findOne({
          where: {
            id: registroId,
          },
        });

        return String(registro?.fotografiaPrincipalId ?? '') === fotografiaId;
      }

      case TipoPatrimonio.PLAZA: {
        const registro = await this.plazasRepository.findOne({
          where: {
            id: registroId,
          },
        });

        return String(registro?.fotografiaPrincipalId ?? '') === fotografiaId;
      }

      case TipoPatrimonio.MUSEO: {
        const registro = await this.museosRepository.findOne({
          where: {
            id: registroId,
          },
        });

        return String(registro?.fotografiaPrincipalId ?? '') === fotografiaId;
      }

      case TipoPatrimonio.AUDITORIO: {
        const registro = await this.auditoriosRepository.findOne({
          where: {
            id: registroId,
          },
        });

        return String(registro?.fotografiaPrincipalId ?? '') === fotografiaId;
      }
    }
  }
}
