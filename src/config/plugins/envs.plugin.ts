import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  PROD: env.get('PROD').required().asString(),

  MONGO_URL: env.get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
  MONGO_USER: env.get('MONGO_USER').required().asString(),
  MONGO_PASSWORD: env.get('MONGO_PASSWORD').required().asString(),

  MYSQL_HOST: env.get('MYSQL_HOST').required().asString(),
  MYSQL_PORT: env.get('MYSQL_PORT').required().asPortNumber(),
  MYSQL_USER: env.get('MYSQL_USER').required().asString(),
  MYSQL_PASSWORD: env.get('MYSQL_PASSWORD').required().asString(),
  MYSQL_DATABASE: env.get('MYSQL_DATABASE').required().asString(),

}