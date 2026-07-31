import 'dotenv/config';

import { DataSource } from 'typeorm';

const databasePort = Number(process.env.DB_PORT ?? 5432);

if (Number.isNaN(databasePort)) {
  throw new Error('La variable DB_PORT debe contener un número válido.');
}

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: databasePort,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],

  synchronize: false,
  logging: false,
});
