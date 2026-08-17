import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { RolUsuario } from '../modules/usuarios/enums/rol-usuario.enum';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Usuario],
  synchronize: false,
});

async function main(): Promise<void> {
  await dataSource.initialize();

  const repository = dataSource.getRepository(Usuario);

  const username = 'admin';

  const existente = await repository.findOne({
    where: {
      username,
    },
  });

  if (existente) {
    console.log('El usuario administrador ya existe.');
    await dataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash('Admin123*', 12);

  const usuario = repository.create({
    username,
    password: passwordHash,
    nombres: 'Administrador',
    apellidos: 'SIGPAC',
    email: 'admin@zamora.gob.ec',
    rol: RolUsuario.ADMINISTRADOR,
    activo: true,
    ultimoAcceso: null,
  });

  await repository.save(usuario);

  console.log('Usuario administrador creado correctamente.');

  await dataSource.destroy();
}

main().catch((error) => {
  console.error('Error al crear usuario administrador:', error);

  process.exit(1);
});
