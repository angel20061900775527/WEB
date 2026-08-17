import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

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
}
