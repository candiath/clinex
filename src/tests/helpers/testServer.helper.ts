import express, { Router } from "express";
import { Server } from "../../presentation/server";

/**
 * Helper for creating and managing test server instances
 */
export class TestServerHelper {
  private static serverInstance: Server | null = null;
  private static appInstance: express.Application | null = null;

  /**
   * Create a test server instance with the given routes
   * @param routes Router to use for the server
   * @returns Express application instance for testing with supertest
   */
  static createTestServer(routes: Router): express.Application {
    if (this.appInstance) {
      return this.appInstance;
    }

    // Create server with port 0 (random available port)
    this.serverInstance = new Server({
      port: 0,
      routes: routes,
      publicPath: "public",
    });

    // Get the Express app without starting the HTTP server
    this.appInstance = this.serverInstance.app;

    return this.appInstance;
  }

  /**
   * Get the current app instance
   * Throws if server hasn't been created yet
   */
  static getApp(): express.Application {
    if (!this.appInstance) {
      throw new Error("Test server not created. Call createTestServer() first.");
    }
    return this.appInstance;
  }

  /**
   * Clean up the test server
   * Call this in afterAll() if needed
   */
  static cleanup(): void {
    this.serverInstance = null;
    this.appInstance = null;
  }
}
