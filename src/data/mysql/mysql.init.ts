import mysql from 'mysql2/promise';
import { envs } from '../../config/plugins/envs.plugin';

/**
 * Configuration interface for MySQL connection
 * Allows dependency injection for different environments (dev, test, prod)
 */
export interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections?: boolean;
  connectionLimit?: number;
  queueLimit?: number;
  connectTimeout?: number;
}

export class MySQLDatabase {
  static pool: mysql.Pool;
  private static config: MySQLConfig | null = null;

  /**
   * Set configuration before connecting
   * Useful for testing with different database settings
   */
  static setConfig(config: MySQLConfig): void {
    this.config = config;
  }

  /**
   * Get current configuration
   * Falls back to envs.plugin if no config was explicitly set
   */
  private static getConfig(): MySQLConfig {
    if (this.config) {
      return this.config;
    }
    
    // Fallback to environment variables for backward compatibility
    return {
      host: envs.MYSQL_HOST,
      port: envs.MYSQL_PORT,
      user: envs.MYSQL_USER,
      password: envs.MYSQL_PASSWORD,
      database: envs.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000,
    };
  }

  static async connect(): Promise<void> {
    try {
      const config = this.getConfig();
      
      this.pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: config.waitForConnections ?? true,
        connectionLimit: config.connectionLimit ?? 10,
        queueLimit: config.queueLimit ?? 0,
        connectTimeout: config.connectTimeout ?? 60000,
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

  /**
   * Reset configuration and pool
   * Useful for cleaning up between test suites
   */
  static reset(): void {
    this.config = null;
    // Pool will be closed by disconnect()
  }
}