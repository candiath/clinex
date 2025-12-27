import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  PROD: env.get('PROD').required().asString(),

  RUN_SCHEMA_CHECK: env.get('RUN_SCHEMA_CHECK').default('false').asBool(),

  MYSQL_HOST: env.get('MYSQL_HOST').required().asString(),
  MYSQL_PORT: env.get('MYSQL_PORT').required().asPortNumber(),
  MYSQL_USER: env.get('MYSQL_USER').required().asString(),
  MYSQL_PASSWORD: env.get('MYSQL_PASSWORD').required().asString(),
  MYSQL_DATABASE: env.get('MYSQL_DATABASE').required().asString(),

}