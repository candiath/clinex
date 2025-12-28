import { envs } from "./config/plugins/envs.plugin";
import { MySQLDatabase } from "./data/mysql/mysql.init";
import { MigrationRunner } from "./data/mysql/migrations.runner";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(()=>{main()})()

async function main() {
  // console.log('Hello, World!!!');

  await MySQLDatabase.connect();
  await MigrationRunner.runMigrations();
  
  if (envs.RUN_SCHEMA_CHECK) {
    const isValid = await MigrationRunner.verifySchema(['patients', 'doctors']);
    if (!isValid) {
      throw new Error('Database schema validation failed. Check migrations.');
    }
  }
  
  const server = new Server( {
    port: envs.PORT,
    routes: AppRoutes.routes,
    publicPath: 'public'
  });

  server.start();
}