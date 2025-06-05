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
  }

  async start() {
    // Middlewares
    this.app.use( express.json() )
    this.app.use( express.urlencoded( { extended: true }) );
    // this.app.use( this.publicPath, express.static( 'public' ));

    // Routes
    this.app.use( this.routes );

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