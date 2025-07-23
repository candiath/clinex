import mysql from 'mysql2/promise';
import { envs } from '../../config/plugins/envs.plugin';


export class MySQLDatabase {
  static pool: mysql.Pool;

  static async connect(): Promise<void> {
    try {
      this.pool = mysql.createPool({
        host: envs.MYSQL_HOST,
        port: envs.MYSQL_PORT,
        user: envs.MYSQL_USER,
        password: envs.MYSQL_PASSWORD,
        database: envs.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        // Performance optimizations for healthcare
        connectTimeout: 60000,
      });
      
      // Test connection
      const connection = await this.pool.getConnection();
      console.log('MySQL connected successfully');
      connection.release();
    } catch (error) {
      console.error('MySQL connection error:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log('====> MySQL connection closed');
    }
  }
}