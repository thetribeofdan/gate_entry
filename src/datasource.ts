// src/datasource.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    isProd
      ? join(__dirname, '/**/entities/*.entity.js')
      : 'src/**/entities/*.entity.ts',
  ],
  migrations: [
    isProd
      ? join(__dirname, '/**/migrations/*.js')
      : 'src/**/migrations/*.ts',
  ],
});
