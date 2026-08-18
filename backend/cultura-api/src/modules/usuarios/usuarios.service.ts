import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { ChangePasswordDto } from './dto/request/change-password.dto';
import { CreateUsuarioDto } from './dto/request/create-usuario.dto';
import { UpdateEstadoUsuarioDto } from './dto/request/update-estado-usuario.dto';
import { UpdateUsuarioDto } from './dto/request/update-usuario.dto';
import { UsuarioResponseDto } from './dto/response/usuario-response.dto';
import { Usuario } from './entities/usuario.entity';
import { RolUsuario } from './enums/rol-usuario.enum';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  /*
   * Métodos utilizados por autenticación
   */

  async findByUsername(username: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: {
        username,
        activo: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: {
        email,
        activo: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: {
        id,
        activo: true,
      },
    });
  }

  async updateUltimoAcceso(id: number): Promise<void> {
    await this.usuariosRepository.update(id, {
      ultimoAcceso: new Date(),
    });
  }

  /*
   * Administración de usuarios
   */

  async findAll(search = ''): Promise<UsuarioResponseDto[]> {
    const queryBuilder = this.usuariosRepository
      .createQueryBuilder('usuario')
      .orderBy('usuario.nombres', 'ASC')
      .addOrderBy('usuario.apellidos', 'ASC');

    const busqueda = search.trim();

    if (busqueda) {
      queryBuilder.where(
        `(
          usuario.username ILIKE :search
          OR usuario.nombres ILIKE :search
          OR usuario.apellidos ILIKE :search
          OR usuario.email ILIKE :search
        )`,
        {
          search: `%${busqueda}%`,
        },
      );
    }

    const usuarios = await queryBuilder.getMany();

    return usuarios.map((usuario) => UsuarioResponseDto.fromEntity(usuario));
  }

  async findAdminById(id: number): Promise<UsuarioResponseDto> {
    const usuario = await this.findEntityById(id);

    return UsuarioResponseDto.fromEntity(usuario);
  }

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioResponseDto> {
    const username = createUsuarioDto.username.trim().toLowerCase();

    const email = createUsuarioDto.email.trim().toLowerCase();

    await this.validateUniqueFields(username, email);

    const passwordHash = await bcrypt.hash(createUsuarioDto.password, 12);

    const usuario = this.usuariosRepository.create({
      username,
      password: passwordHash,
      nombres: createUsuarioDto.nombres.trim(),
      apellidos: createUsuarioDto.apellidos.trim(),
      email,
      rol: createUsuarioDto.rol,
      activo: true,
    });

    const usuarioGuardado = await this.usuariosRepository.save(usuario);

    return UsuarioResponseDto.fromEntity(usuarioGuardado);
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
    usuarioAutenticadoId: number | string,
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.findEntityById(id);

    const esMismoUsuario = Number(id) === Number(usuarioAutenticadoId);

    if (
      esMismoUsuario &&
      updateUsuarioDto.rol !== undefined &&
      updateUsuarioDto.rol !== RolUsuario.ADMINISTRADOR
    ) {
      throw new BadRequestException(
        'No puede quitarse su propio rol de administrador.',
      );
    }

    const username =
      updateUsuarioDto.username !== undefined
        ? updateUsuarioDto.username.trim().toLowerCase()
        : usuario.username;

    const email =
      updateUsuarioDto.email !== undefined
        ? updateUsuarioDto.email.trim().toLowerCase()
        : usuario.email;

    await this.validateUniqueFields(username, email, id);

    if (updateUsuarioDto.username !== undefined) {
      usuario.username = username;
    }

    if (updateUsuarioDto.nombres !== undefined) {
      usuario.nombres = updateUsuarioDto.nombres.trim();
    }

    if (updateUsuarioDto.apellidos !== undefined) {
      usuario.apellidos = updateUsuarioDto.apellidos.trim();
    }

    if (updateUsuarioDto.email !== undefined) {
      usuario.email = email;
    }

    if (updateUsuarioDto.rol !== undefined) {
      usuario.rol = updateUsuarioDto.rol;
    }

    const usuarioActualizado = await this.usuariosRepository.save(usuario);

    return UsuarioResponseDto.fromEntity(usuarioActualizado);
  }

  async updateEstado(
    id: number,
    updateEstadoUsuarioDto: UpdateEstadoUsuarioDto,
    usuarioAutenticadoId: number | string,
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.findEntityById(id);

    const esMismoUsuario = Number(id) === Number(usuarioAutenticadoId);

    if (esMismoUsuario && updateEstadoUsuarioDto.activo !== usuario.activo) {
      throw new BadRequestException(
        'No puede modificar el estado de su propio usuario.',
      );
    }

    usuario.activo = updateEstadoUsuarioDto.activo;

    const usuarioActualizado = await this.usuariosRepository.save(usuario);

    return UsuarioResponseDto.fromEntity(usuarioActualizado);
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const usuario = await this.findEntityById(id);

    usuario.password = await bcrypt.hash(changePasswordDto.password, 12);

    await this.usuariosRepository.save(usuario);
  }

  /*
   * Métodos internos
   */

  private async findEntityById(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: {
        id,
      },
    });

    if (!usuario) {
      throw new NotFoundException('No se encontró el usuario indicado.');
    }

    return usuario;
  }

  private async validateUniqueFields(
    username: string,
    email: string,
    idExcluir?: number,
  ): Promise<void> {
    const usernameQuery = this.usuariosRepository
      .createQueryBuilder('usuario')
      .where('LOWER(usuario.username) = LOWER(:username)', {
        username,
      });

    if (idExcluir !== undefined) {
      usernameQuery.andWhere('usuario.id != :idExcluir', {
        idExcluir,
      });
    }

    const usernameExistente = await usernameQuery.getOne();

    if (usernameExistente) {
      throw new ConflictException(
        'Ya existe un usuario registrado con ese nombre de usuario.',
      );
    }

    const emailQuery = this.usuariosRepository
      .createQueryBuilder('usuario')
      .where('LOWER(usuario.email) = LOWER(:email)', {
        email,
      });

    if (idExcluir !== undefined) {
      emailQuery.andWhere('usuario.id != :idExcluir', {
        idExcluir,
      });
    }

    const emailExistente = await emailQuery.getOne();

    if (emailExistente) {
      throw new ConflictException(
        'Ya existe un usuario registrado con ese correo electrónico.',
      );
    }
  }
}
