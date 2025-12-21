import express, { Router } from 'express';

export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor( options: {
    port: number,
    routes: Router,
    publicPath: string
  } ) {
    this.port = options.port;
    this.routes = options.routes;
    this.publicPath = options.publicPath;
    
    // Configure middlewares immediately
    this.app.use( express.json() )
    this.app.use( express.urlencoded( { extended: true }) );
    
    // Mount routes
    this.app.use( this.routes );
  }

  async start() {
    // Middlewares and routes already configured in constructor
    // No need to reconfigure here

    return new Promise<void>( ( resolve, reject ) => {
      this.serverListener = this.app.listen( this.port, () => {
        console.log( `Server running on port ${this.port}` );
        resolve();
      } ).on( 'error', ( error: Error ) => {
        console.error( 'Error starting server:', error );
        reject( error );
      } );
    } );
  }

  public close() {
    // this.serverListener?.close();
    this.serverListener.close();
  }
}